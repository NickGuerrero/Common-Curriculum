const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { describe, it, beforeEach, afterEach } = require('node:test');

const lib = require('../netlify/functions/canvas-progress-lib');
const progress = require('../netlify/functions/canvas-progress');
const launch = require('../netlify/functions/canvas-lti-launch');

const CUSTOM_CLAIM = 'https://purl.imsglobal.org/spec/lti/claim/custom';

let originalEnv;
let originalFetch;

function signRsJwt(payload, privateKey, kid) {
  const now = Math.floor(Date.now() / 1000);
  const body = { iat: now, exp: now + 600, ...payload };
  const signingInput = `${lib.base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid }))}.${lib.base64url(JSON.stringify(body))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer
    .sign(privateKey)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${signingInput}.${signature}`;
}

function jsonResponse(data) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    headers: { get: () => null },
  };
}

describe('Canvas LTI progress integration', () => {
  beforeEach(() => {
    originalEnv = { ...process.env };
    originalFetch = global.fetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('validates a Canvas-style LTI id_token with JWKS', async () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const jwk = publicKey.export({ format: 'jwk' });
    jwk.kid = 'test-key';
    jwk.use = 'sig';
    jwk.alg = 'RS256';

    const idToken = signRsJwt(
      {
        iss: 'https://canvas.example.edu',
        aud: 'client-123',
        nonce: 'nonce-1',
        sub: 'opaque-user',
      },
      privateKey,
      'test-key'
    );

    const payload = await lib.verifyLtiIdToken(idToken, {
      jwks: { keys: [jwk] },
      issuer: 'https://canvas.example.edu',
      clientId: 'client-123',
      nonce: 'nonce-1',
    });

    assert.equal(payload.sub, 'opaque-user');
  });

  it('launches to the hosted page with a short-lived progress token', async () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const jwk = publicKey.export({ format: 'jwk' });
    jwk.kid = 'launch-key';
    jwk.use = 'sig';
    jwk.alg = 'RS256';

    process.env.LTI_CLIENT_ID = 'client-123';
    process.env.LTI_STATE_SECRET = 'state-secret';
    process.env.PROGRESS_JWT_SECRET = 'progress-secret';
    process.env.CANVAS_JWKS_URL = 'https://canvas.example.edu/jwks';
    process.env.LTI_ALLOWED_TARGET_ORIGINS = 'https://profsathya.github.io';

    global.fetch = async (url) => {
      assert.equal(url, 'https://canvas.example.edu/jwks');
      return jsonResponse({ keys: [jwk] });
    };

    const target = 'https://profsathya.github.io/Common-Curriculum/deanza/course1/home.html';
    const state = lib.signHmacJwt(
      {
        type: 'lti_state',
        iss: 'https://canvas.example.edu',
        nonce: 'nonce-2',
        target_link_uri: target,
      },
      'state-secret',
      600
    );
    const idToken = signRsJwt(
      {
        iss: 'https://canvas.example.edu',
        aud: 'client-123',
        nonce: 'nonce-2',
        sub: 'opaque-user',
        [CUSTOM_CLAIM]: {
          canvas_course_id: '180',
          canvas_user_id: '42',
        },
      },
      privateKey,
      'launch-key'
    );

    const event = {
      httpMethod: 'POST',
      body: new URLSearchParams({ state, id_token: idToken }).toString(),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    };

    const result = await launch.handler(event);

    assert.equal(result.statusCode, 302);
    const location = new URL(result.headers.Location);
    assert.equal(location.searchParams.get('context'), 'canvas');
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const progressToken = hash.get('progress_token');
    assert.ok(progressToken);
    const progressPayload = lib.verifyHmacJwt(progressToken, 'progress-secret', 'canvas_progress');
    assert.equal(progressPayload.courseId, '180');
    assert.equal(progressPayload.userId, '42');
  });

  it('fetches progress for the signed learner, not a request-supplied student_id', async () => {
    process.env.PROGRESS_JWT_SECRET = 'progress-secret';
    process.env.CANVAS_API_BASE_URL = 'https://canvas.example.edu';
    process.env.CANVAS_API_TOKEN = 'canvas-token';
    process.env.PROGRESS_ALLOWED_ORIGINS = 'https://profsathya.github.io';
    const token = lib.signHmacJwt(
      {
        type: 'canvas_progress',
        courseId: '180',
        userId: '42',
      },
      'progress-secret',
      600
    );
    const urls = [];
    global.fetch = async (url, options) => {
      urls.push(url);
      assert.equal(options.headers.Authorization, 'Bearer canvas-token');
      if (url.includes('/modules?')) {
        return jsonResponse([{ id: 1946 }]);
      }
      assert.match(url, /student_id=42/);
      assert.doesNotMatch(url, /student_id=999/);
      return jsonResponse([
        {
          id: 17710,
          module_id: 1946,
          title: 'Start Here',
          type: 'Page',
          page_url: 'start-here',
          completion_requirement: { type: 'must_view', completed: true },
        },
      ]);
    };

    const result = await progress.handler({
      httpMethod: 'GET',
      queryStringParameters: { student_id: '999' },
      headers: {
        Authorization: `Bearer ${token}`,
        origin: 'https://profsathya.github.io',
      },
    });

    assert.equal(result.statusCode, 200);
    const body = JSON.parse(result.body);
    assert.equal(body.items[0].moduleItemId, 17710);
    assert.equal(body.items[0].completed, true);
    assert.equal(urls.length, 2);
  });
});

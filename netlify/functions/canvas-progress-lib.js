const crypto = require('node:crypto');

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlJson(payload) {
  return base64url(JSON.stringify(payload));
}

function decodeBase64url(value) {
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function decodeJwt(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT shape');
  return {
    header: JSON.parse(decodeBase64url(parts[0]).toString('utf8')),
    payload: JSON.parse(decodeBase64url(parts[1]).toString('utf8')),
    signingInput: `${parts[0]}.${parts[1]}`,
    signature: parts[2],
  };
}

function signHmacJwt(payload, secret, ttlSeconds) {
  if (!secret) throw new Error('Missing JWT signing secret');
  const now = Math.floor(Date.now() / 1000);
  const body = {
    iat: now,
    exp: now + ttlSeconds,
    ...payload,
  };
  const signingInput = `${base64urlJson({ alg: 'HS256', typ: 'JWT' })}.${base64urlJson(body)}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${signingInput}.${signature}`;
}

function verifyHmacJwt(token, secret, expectedType) {
  if (!secret) throw new Error('Missing JWT signing secret');
  const decoded = decodeJwt(token);
  if (decoded.header.alg !== 'HS256') throw new Error('Unsupported token algorithm');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(decoded.signingInput)
    .digest();
  const actual = decodeBase64url(decoded.signature);
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    throw new Error('Invalid token signature');
  }
  const now = Math.floor(Date.now() / 1000);
  if (decoded.payload.exp && decoded.payload.exp < now) throw new Error('Token expired');
  if (decoded.payload.nbf && decoded.payload.nbf > now) throw new Error('Token not active');
  if (expectedType && decoded.payload.type !== expectedType) throw new Error('Unexpected token type');
  return decoded.payload;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GET ${url} -> ${response.status}`);
  return response.json();
}

async function resolveJwks(options) {
  if (options.jwks) return options.jwks;
  if (!options.jwksUrl) throw new Error('Missing Canvas JWKS URL');
  return fetchJson(options.jwksUrl);
}

async function verifyLtiIdToken(idToken, options) {
  const decoded = decodeJwt(idToken);
  if (decoded.header.alg !== 'RS256') throw new Error('Unsupported LTI token algorithm');
  const jwks = await resolveJwks(options);
  const key = (jwks.keys || []).find((candidate) => candidate.kid === decoded.header.kid);
  if (!key) throw new Error('LTI signing key not found');
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(decoded.signingInput);
  verifier.end();
  const valid = verifier.verify(
    crypto.createPublicKey({ key, format: 'jwk' }),
    decodeBase64url(decoded.signature)
  );
  if (!valid) throw new Error('Invalid LTI token signature');

  const now = Math.floor(Date.now() / 1000);
  if (decoded.payload.exp && decoded.payload.exp < now) throw new Error('LTI token expired');
  if (options.issuer && decoded.payload.iss !== options.issuer) throw new Error('Unexpected LTI issuer');
  const audience = Array.isArray(decoded.payload.aud) ? decoded.payload.aud : [decoded.payload.aud];
  if (options.clientId && !audience.includes(options.clientId)) throw new Error('Unexpected LTI audience');
  if (options.nonce && decoded.payload.nonce !== options.nonce) throw new Error('Unexpected LTI nonce');
  return decoded.payload;
}

function allowedOrigin(origin, allowlist) {
  if (!origin) return false;
  return allowlist.includes('*') || allowlist.includes(origin);
}

function parseAllowlist(value, fallback) {
  return String(value || fallback || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function allowedValues(primary, allowlistValue) {
  return [...new Set([
    ...parseAllowlist(primary, ''),
    ...parseAllowlist(allowlistValue, ''),
  ])];
}

function valueAllowed(value, allowlist) {
  if (!allowlist.length) return true;
  return allowlist.includes('*') || allowlist.includes(String(value));
}

function audienceAllowed(audience, allowlist) {
  if (!allowlist.length) return true;
  const values = Array.isArray(audience) ? audience : [audience];
  return values.some((value) => valueAllowed(value, allowlist));
}

function corsHeaders(event, env = process.env) {
  const allowlist = parseAllowlist(env.PROGRESS_ALLOWED_ORIGINS, 'https://profsathya.github.io');
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const allowed = allowedOrigin(origin, allowlist) ? origin : allowlist[0];
  return {
    'Access-Control-Allow-Origin': allowed || 'https://profsathya.github.io',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Vary': 'Origin',
  };
}

function jsonResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  };
}

function redirect(location) {
  return {
    statusCode: 302,
    headers: { Location: location },
    body: '',
  };
}

function formBody(event) {
  const body = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';
  return new URLSearchParams(body);
}

function appendProgressToken(targetUrl, progressToken) {
  const url = new URL(targetUrl);
  url.searchParams.set('context', 'canvas');
  const hash = new URLSearchParams((url.hash || '').replace(/^#/, ''));
  hash.set('progress_token', progressToken);
  url.hash = hash.toString();
  return url.href;
}

function targetAllowed(targetUrl, env = process.env) {
  const allowlist = parseAllowlist(env.LTI_ALLOWED_TARGET_ORIGINS, 'https://profsathya.github.io');
  const origin = new URL(targetUrl).origin;
  return allowedOrigin(origin, allowlist);
}

async function canvasGetAllPages(baseUrl, token, path) {
  const results = [];
  let url = `${baseUrl.replace(/\/$/, '')}${path}`;
  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Canvas API ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data)) results.push(...data);
    const link = response.headers?.get ? response.headers.get('link') : null;
    const match = link && link.match(/<([^>]+)>;\s*rel="next"/);
    url = match ? match[1] : null;
  }
  return results;
}

function completionFromModuleItem(item) {
  const requirement = item.completion_requirement || null;
  return {
    moduleItemId: item.id,
    moduleId: item.module_id,
    title: item.title,
    type: item.type,
    contentId: item.content_id ?? null,
    pageUrl: item.page_url ?? null,
    requirementType: requirement?.type || null,
    completed: Boolean(requirement?.completed),
  };
}

module.exports = {
  appendProgressToken,
  base64url,
  canvasGetAllPages,
  completionFromModuleItem,
  corsHeaders,
  decodeJwt,
  formBody,
  jsonResponse,
  parseAllowlist,
  allowedValues,
  audienceAllowed,
  redirect,
  signHmacJwt,
  targetAllowed,
  valueAllowed,
  verifyHmacJwt,
  verifyLtiIdToken,
};

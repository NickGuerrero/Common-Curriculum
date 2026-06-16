const {
  appendProgressToken,
  formBody,
  jsonResponse,
  redirect,
  signHmacJwt,
  targetAllowed,
  verifyHmacJwt,
  verifyLtiIdToken,
} = require('./canvas-progress-lib');

const CUSTOM_CLAIM = 'https://purl.imsglobal.org/spec/lti/claim/custom';
const DEPLOYMENT_CLAIM = 'https://purl.imsglobal.org/spec/lti/claim/deployment_id';

function customValue(custom, names) {
  for (const name of names) {
    if (custom && custom[name] != null && custom[name] !== '') return String(custom[name]);
  }
  return null;
}

function canvasIdsFromLtiPayload(payload) {
  const custom = payload[CUSTOM_CLAIM] || {};
  return {
    courseId: customValue(custom, ['canvas_course_id', 'custom_canvas_course_id', 'course_id']),
    userId: customValue(custom, ['canvas_user_id', 'custom_canvas_user_id', 'user_id']),
  };
}

function jwksUrlForIssuer(issuer, env = process.env) {
  if (env.CANVAS_JWKS_URL) return env.CANVAS_JWKS_URL;
  if (String(issuer).includes('beta')) return 'https://sso.beta.canvaslms.com/api/lti/security/jwks';
  if (String(issuer).includes('test')) return 'https://sso.test.canvaslms.com/api/lti/security/jwks';
  return 'https://sso.canvaslms.com/api/lti/security/jwks';
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const params = formBody(event);
  const stateToken = params.get('state');
  const idToken = params.get('id_token');
  const secret = process.env.LTI_STATE_SECRET || process.env.PROGRESS_JWT_SECRET;
  const progressSecret = process.env.PROGRESS_JWT_SECRET;
  const clientId = process.env.LTI_CLIENT_ID;

  if (!stateToken || !idToken || !secret || !progressSecret || !clientId) {
    return jsonResponse(400, { error: 'Missing required LTI launch configuration or parameters' });
  }

  try {
    const state = verifyHmacJwt(stateToken, secret, 'lti_state');
    if (!targetAllowed(state.target_link_uri)) {
      return jsonResponse(400, { error: 'target_link_uri is not allowed' });
    }

    const ltiPayload = await verifyLtiIdToken(idToken, {
      issuer: process.env.LTI_ISSUER || state.iss,
      clientId,
      nonce: state.nonce,
      jwksUrl: jwksUrlForIssuer(state.iss),
    });

    if (process.env.LTI_DEPLOYMENT_ID && ltiPayload[DEPLOYMENT_CLAIM] !== process.env.LTI_DEPLOYMENT_ID) {
      return jsonResponse(403, { error: 'Unexpected LTI deployment' });
    }

    const ids = canvasIdsFromLtiPayload(ltiPayload);
    if (!ids.courseId || !ids.userId) {
      return jsonResponse(400, {
        error: 'LTI launch is missing Canvas course/user custom parameters',
      });
    }

    const progressToken = signHmacJwt(
      {
        type: 'canvas_progress',
        iss: ltiPayload.iss,
        sub: ltiPayload.sub,
        courseId: ids.courseId,
        userId: ids.userId,
      },
      progressSecret,
      Number(process.env.PROGRESS_TOKEN_TTL_SECONDS || 10 * 60)
    );

    return redirect(appendProgressToken(state.target_link_uri, progressToken));
  } catch (error) {
    console.error('LTI launch failed:', error);
    return jsonResponse(401, { error: 'Invalid LTI launch' });
  }
};

module.exports.canvasIdsFromLtiPayload = canvasIdsFromLtiPayload;
module.exports.jwksUrlForIssuer = jwksUrlForIssuer;

const crypto = require('node:crypto');
const {
  formBody,
  jsonResponse,
  redirect,
  signHmacJwt,
  targetAllowed,
} = require('./canvas-progress-lib');

function oidcAuthUrl(issuer, env = process.env) {
  return env.CANVAS_OIDC_AUTH_URL || `${String(issuer).replace(/\/$/, '')}/api/lti/authorize_redirect`;
}

exports.handler = async (event) => {
  if (!['GET', 'POST'].includes(event.httpMethod)) {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const params = event.httpMethod === 'POST'
    ? Object.fromEntries(formBody(event).entries())
    : event.queryStringParameters || {};
  const clientId = params.client_id || process.env.LTI_CLIENT_ID;
  const redirectUri = process.env.LTI_REDIRECT_URI;
  const target = params.target_link_uri || process.env.LTI_DEFAULT_TARGET_LINK_URI;
  const secret = process.env.LTI_STATE_SECRET || process.env.PROGRESS_JWT_SECRET;

  if (!params.iss || !params.login_hint || !params.lti_message_hint || !clientId || !redirectUri || !target || !secret) {
    return jsonResponse(400, { error: 'Missing required LTI login configuration or parameters' });
  }
  if (process.env.LTI_CLIENT_ID && clientId !== process.env.LTI_CLIENT_ID) {
    return jsonResponse(400, { error: 'Unexpected LTI client_id' });
  }
  if (!targetAllowed(target)) {
    return jsonResponse(400, { error: 'target_link_uri is not allowed' });
  }

  const nonce = crypto.randomBytes(16).toString('hex');
  const state = signHmacJwt(
    {
      type: 'lti_state',
      iss: params.iss,
      nonce,
      target_link_uri: target,
    },
    secret,
    10 * 60
  );

  const url = new URL(oidcAuthUrl(params.iss));
  url.searchParams.set('scope', 'openid');
  url.searchParams.set('response_type', 'id_token');
  url.searchParams.set('response_mode', 'form_post');
  url.searchParams.set('prompt', 'none');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('login_hint', params.login_hint);
  url.searchParams.set('lti_message_hint', params.lti_message_hint);
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);

  return redirect(url.href);
};

module.exports.oidcAuthUrl = oidcAuthUrl;

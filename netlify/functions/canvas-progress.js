const {
  canvasGetAllPages,
  completionFromModuleItem,
  corsHeaders,
  jsonResponse,
  verifyHmacJwt,
} = require('./canvas-progress-lib');

function bearerToken(event) {
  const header = event.headers?.authorization || event.headers?.Authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

async function loadProgress(courseId, userId, env = process.env) {
  const baseUrl = env.CANVAS_API_BASE_URL || env.CANVAS_API_URL;
  const token = env.CANVAS_API_TOKEN;
  if (!baseUrl || !token) throw new Error('Missing Canvas API configuration');

  const modules = await canvasGetAllPages(
    baseUrl,
    token,
    `/api/v1/courses/${encodeURIComponent(courseId)}/modules?per_page=100`
  );
  const items = [];
  for (const module of modules) {
    const moduleItems = await canvasGetAllPages(
      baseUrl,
      token,
      `/api/v1/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(module.id)}/items?per_page=100&student_id=${encodeURIComponent(userId)}`
    );
    items.push(...moduleItems.map(completionFromModuleItem));
  }
  return { courseId: String(courseId), items };
}

exports.handler = async (event) => {
  const cors = corsHeaders(event);
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' }, cors);
  }

  try {
    const token = bearerToken(event);
    if (!token) return jsonResponse(401, { error: 'Missing bearer token' }, cors);
    const payload = verifyHmacJwt(token, process.env.PROGRESS_JWT_SECRET, 'canvas_progress');
    const progress = await loadProgress(payload.courseId, payload.userId);
    return jsonResponse(
      200,
      {
        courseId: progress.courseId,
        items: progress.items,
      },
      cors
    );
  } catch (error) {
    console.error('Canvas progress failed:', error);
    return jsonResponse(401, { error: 'Progress unavailable' }, cors);
  }
};

module.exports.bearerToken = bearerToken;
module.exports.loadProgress = loadProgress;

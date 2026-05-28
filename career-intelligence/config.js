/**
 * Career Discovery Form v4 — Configuration
 */
export const CONFIG = {
  api_endpoint: 'https://ai-assisted-pedagogy.netlify.app/.netlify/functions/ai-proxy',
  form_version: '5.0',
  model: 'claude-sonnet-4-6',
  max_tokens: 2500,
  synthesis_timeout_ms: 45000,
  retry_delays: [2000, 4000, 8000],
  dates_placeholder: 'Summer 2026 (exact dates TBD)',
  placeholder_text: 'Take your time — the more specific you are, the more useful the response will be. (Minimum 20 characters)',
};

export const PROGRAM_CONFIG = {
  program_name: 'Career Intelligence — Part I',
  dates: 'Start date: March 17 or March 24',
  session_times: 'Two weeks — about 3.5 hours per week',
  description: [
    'Career Intelligence is a program designed for graduating seniors who want to go beyond the standard job search.',
    '',
    '• Two weeks — about 3.5 hours per week',
    '• 1.5 hours of synchronous session and 2 hours of asynchronous work',
    '• Start date: March 17 or March 24',
    '',
    'Over the program, you\'ll work through:',
    '• Strategic market mapping — understanding where your skills meet real demand',
    '• Value proposition development — articulating what makes you distinct, not just qualified',
    '• An experimental approach to your search — testing directions instead of guessing',
    '',
    'The program builds on the kind of self-assessment you just completed, going deeper with structured exercises and peer feedback.',
  ].join('\n'),
};

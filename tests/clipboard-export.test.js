/**
 * Activity Engine — clipboard export smoke test
 *
 * Stubs navigator.clipboard.writeText and exercises the exposed
 * ActivityEngine._copyMarkdownToClipboard() helper that handleDownload()
 * calls after gating passes.
 */

const { test } = require('node:test');
const assert = require('node:assert');

// Node 21+ exposes a built-in `navigator` that can't be replaced via assignment,
// but individual properties are writable. Patch `navigator.clipboard` directly.
function ensureNavigator() {
  if (typeof globalThis.navigator === 'undefined') {
    globalThis.navigator = {};
  }
}

test('ActivityEngine._copyMarkdownToClipboard writes markdown to the clipboard', async () => {
  ensureNavigator();
  const calls = [];
  const originalClipboard = globalThis.navigator.clipboard;
  globalThis.navigator.clipboard = {
    writeText: (text) => {
      calls.push(text);
      return Promise.resolve();
    }
  };

  delete require.cache[require.resolve('../js/activity-engine.js')];
  const ActivityEngine = require('../js/activity-engine.js');

  const studentMarkdown =
    '# Goal Statement\n\n**Student:** Jane Doe\n\nMy Sprint 4 goal is to extend the MDRO decontamination retry layer...';

  try {
    await ActivityEngine._copyMarkdownToClipboard(studentMarkdown);

    assert.strictEqual(calls.length, 1, 'writeText should be called exactly once');
    assert.strictEqual(calls[0], studentMarkdown, 'writeText should receive the exact markdown string');
    assert.ok(calls[0].includes('Jane Doe'), 'clipboard payload should contain student identifiers');
    assert.ok(calls[0].includes('Sprint 4 goal'), 'clipboard payload should contain the student response body');
  } finally {
    globalThis.navigator.clipboard = originalClipboard;
  }
});

test('ActivityEngine._copyMarkdownToClipboard rejects when Clipboard API is unavailable', async () => {
  ensureNavigator();
  const originalClipboard = globalThis.navigator.clipboard;
  globalThis.navigator.clipboard = undefined;

  delete require.cache[require.resolve('../js/activity-engine.js')];
  const ActivityEngine = require('../js/activity-engine.js');

  try {
    await assert.rejects(
      () => ActivityEngine._copyMarkdownToClipboard('anything'),
      /Clipboard API unavailable/
    );
  } finally {
    globalThis.navigator.clipboard = originalClipboard;
  }
});

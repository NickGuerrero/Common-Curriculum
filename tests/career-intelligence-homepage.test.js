const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const homePath = path.join(ROOT, 'career-intelligence', 'canvas', 'home.html');
const progressScriptPath = path.join(ROOT, 'career-intelligence', 'canvas', 'progress.js');
const progressMapPath = path.join(ROOT, 'career-intelligence', 'canvas', 'progress-map.json');

describe('Career Intelligence Canvas homepage', () => {
  it('keeps checkbox progress mapping on the hand-authored homepage', () => {
    const html = fs.readFileSync(homePath, 'utf8');
    const progressIds = html.match(/data-progress-id="/g) || [];
    const moduleItemIds = html.match(/data-canvas-module-item-id="/g) || [];

    assert.equal(progressIds.length, 19);
    assert.equal(moduleItemIds.length, 19);
    assert.match(html, /<script src="progress\.js"><\/script>/);
    assert.match(html, /href="\.\.\/activities\/breakout-1-get-to-know-you\.html"/);
    assert.match(html, /data-canvas-href="https:\/\/cti-courses\.instructure\.com\/courses\/183\/assignments\/6862"/);
  });

  it('keeps progress.js parseable and clear for non-learner Canvas accounts', () => {
    const script = fs.readFileSync(progressScriptPath, 'utf8');

    assert.doesNotThrow(() => new Function(script));
    assert.match(script, /no learner progress was returned for this Canvas account/);
    assert.match(script, /mapped items completed in Canvas/);
  });

  it('keeps progress-map.json aligned with homepage rows', () => {
    const html = fs.readFileSync(homePath, 'utf8');
    const progressMap = JSON.parse(fs.readFileSync(progressMapPath, 'utf8'));

    assert.equal(progressMap.canvasCourseId, 183);
    assert.equal(progressMap.items.length, 19);

    for (const item of progressMap.items) {
      assert.match(html, new RegExp(`data-progress-id="${item.id}"`));
      assert.match(html, new RegExp(`data-canvas-module-item-id="${item.canvasModuleItemId}"`));
      assert.match(html, new RegExp(item.canvasHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });
});

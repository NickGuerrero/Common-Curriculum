#!/usr/bin/env node
/**
 * Update HTML Links Script
 *
 * Bakes Canvas URLs into HTML files based on assignment configuration.
 * This is useful for Canvas iframe embedding where JavaScript might not run reliably.
 *
 * Usage: node scripts/update-html-links.js
 *
 * What it does:
 * - Reads assignment data from config files
 * - Finds HTML files with data-assignment-key attributes
 * - Updates href attributes with correct Canvas URLs
 */

const fs = require('fs');
const path = require('path');

// ============================================
// Configuration
// ============================================

const courses = [
  {
    name: 'CST349',
    configPath: 'config/cst349-config.js',
    baseUrl: null, // Will be extracted from config
    htmlDir: 'cst349'
  },
  {
    name: 'CST395',
    configPath: 'config/cst395-config.js',
    baseUrl: null,
    htmlDir: 'cst395'
  }
];

// ============================================
// Config Parsing
// ============================================

/**
 * Extract assignments and baseUrl from a config file
 */
function parseConfigFile(configPath) {
  const content = fs.readFileSync(configPath, 'utf8');

  // Extract canvasBaseUrl
  const baseUrlMatch = content.match(/canvasBaseUrl:\s*"([^"]+)"/);
  const baseUrl = baseUrlMatch ? baseUrlMatch[1] : null;

  // Extract assignments object
  const assignmentsMatch = content.match(/assignments:\s*\{/);
  if (!assignmentsMatch) {
    throw new Error(`Could not find assignments in ${configPath}`);
  }

  const startIdx = assignmentsMatch.index + assignmentsMatch[0].length - 1;
  let braceCount = 1;
  let endIdx = startIdx + 1;

  while (braceCount > 0 && endIdx < content.length) {
    if (content[endIdx] === '{') braceCount++;
    if (content[endIdx] === '}') braceCount--;
    endIdx++;
  }

  const assignmentsStr = content.substring(startIdx, endIdx);
  let assignments;

  try {
    assignments = eval('(' + assignmentsStr + ')');
  } catch (e) {
    throw new Error(`Failed to parse assignments from ${configPath}: ${e.message}`);
  }

  return { baseUrl, assignments };
}

// ============================================
// HTML Processing
// ============================================

/**
 * Build Canvas URL for an assignment
 */
function buildCanvasUrl(baseUrl, assignment) {
  if (!baseUrl || !assignment.canvasId) return null;

  // Use the correct Canvas path based on entry type:
  // - Quiz entries (canvasType === "quiz") use /quizzes/ with the quiz ID
  // - Regular assignments use /assignments/ with the assignment ID
  if (assignment.canvasType === 'quiz') {
    return `${baseUrl}/quizzes/${assignment.canvasId}`;
  }
  return `${baseUrl}/assignments/${assignment.canvasId}`;
}

/**
 * Update data-assignment-key links in an HTML file
 */
function updateHtmlFile(filePath, key, canvasUrl) {
  if (!fs.existsSync(filePath)) {
    return { updated: false, reason: 'file not found' };
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Pattern: data-assignment-key="key" href="#" or href="..."
  // We want to update href to the Canvas URL
  const pattern = new RegExp(
    `data-assignment-key="${key}"\\s+href="[^"]*"`,
    'g'
  );

  content = content.replace(pattern, `data-assignment-key="${key}" href="${canvasUrl}"`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    return { updated: true };
  }

  return { updated: false, reason: 'no changes needed' };
}

/**
 * Sync canvasUrl inside ActivityEngine.init({...}) on an activity-host HTML page.
 *
 * - If the init block already has a canvasUrl, replace its value.
 * - If it does not, inject a new `canvasUrl: '...'` line right after the
 *   `courseTheme: '<theme>'` line, adding a trailing comma to courseTheme
 *   if one is missing. Indentation is copied from the courseTheme line.
 *
 * Only init blocks whose courseTheme matches `courseTheme` are touched,
 * so a page with multiple init calls (unlikely but defensively handled)
 * won't cross-pollinate courses.
 */
function updateActivityEngineCanvasUrl(filePath, canvasUrl, courseTheme) {
  if (!fs.existsSync(filePath)) {
    return { updated: false, reason: 'file not found' };
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  const initBlockRegex = /ActivityEngine\.init\(\{[\s\S]*?\}\);/g;
  const themeRegex = new RegExp(`courseTheme:\\s*'${courseTheme}'`);
  const existingUrlRegex = /canvasUrl:\s*'[^']*'/;

  content = content.replace(initBlockRegex, (block) => {
    if (!themeRegex.test(block)) return block;

    if (existingUrlRegex.test(block)) {
      return block.replace(existingUrlRegex, `canvasUrl: '${canvasUrl}'`);
    }

    const injectRegex = new RegExp(
      `([ \\t]*)courseTheme:\\s*'${courseTheme}'(,?)(\\s*\\r?\\n)`
    );
    return block.replace(injectRegex, (m, indent, _trailingComma, newline) => {
      return `${indent}courseTheme: '${courseTheme}',${newline}${indent}canvasUrl: '${canvasUrl}'${newline}`;
    });
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    return { updated: true };
  }

  return { updated: false, reason: 'no changes needed' };
}

/**
 * Find all HTML files with data-assignment-key in a directory
 */
function findHtmlFilesWithLinks(dir, key) {
  const files = [];

  function walkDir(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.html')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(`data-assignment-key="${key}"`)) {
          files.push(fullPath);
        }
      }
    }
  }

  walkDir(dir);
  return files;
}

// ============================================
// Main
// ============================================

function main() {
  const rootDir = path.join(__dirname, '..');

  console.log('Update HTML Links');
  console.log('=================');

  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalActivityEngineUpdated = 0;

  for (const course of courses) {
    console.log(`\nProcessing ${course.name}...`);

    const configPath = path.join(rootDir, course.configPath);
    if (!fs.existsSync(configPath)) {
      console.log(`  Config not found: ${course.configPath}`);
      continue;
    }

    const { baseUrl, assignments } = parseConfigFile(configPath);
    if (!baseUrl) {
      console.log('  No baseUrl found in config');
      continue;
    }

    console.log(`  Base URL: ${baseUrl}`);
    console.log(`  Assignments: ${Object.keys(assignments).length}`);

    const htmlDir = path.join(rootDir, course.htmlDir);
    const courseTheme = course.name.toLowerCase();

    for (const [key, assignment] of Object.entries(assignments)) {
      if (!assignment.canvasId) {
        continue; // Skip assignments without Canvas ID
      }

      const canvasUrl = buildCanvasUrl(baseUrl, assignment);
      if (!canvasUrl) continue;

      // Find HTML files that reference this assignment
      const htmlFiles = findHtmlFilesWithLinks(htmlDir, key);

      for (const htmlFile of htmlFiles) {
        const result = updateHtmlFile(htmlFile, key, canvasUrl);
        const relativePath = path.relative(rootDir, htmlFile);

        if (result.updated) {
          console.log(`  Updated: ${relativePath}`);
          totalUpdated++;
        } else {
          totalSkipped++;
        }
      }

      // Sync canvasUrl inside the ActivityEngine.init() on the assignment's
      // own page, so form activities' "Submit on Canvas →" link tracks the CSV.
      if (assignment.htmlFile) {
        const activityHtmlPath = path.join(rootDir, course.htmlDir, assignment.htmlFile);
        const result = updateActivityEngineCanvasUrl(activityHtmlPath, canvasUrl, courseTheme);
        if (result.updated) {
          const relativePath = path.relative(rootDir, activityHtmlPath);
          console.log(`  Updated init: ${relativePath}`);
          totalActivityEngineUpdated++;
        }
      }
    }
  }

  console.log('\n-----------------');
  console.log(`Updated: ${totalUpdated} files`);
  console.log(`Skipped: ${totalSkipped} files`);
  console.log(`ActivityEngine updates: ${totalActivityEngineUpdated} files`);
  console.log('Done!');
}

main();

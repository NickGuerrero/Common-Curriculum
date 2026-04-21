/**
 * Activity Engine
 * Core logic for interactive course activities
 *
 * Handles: state management, localStorage, mobile gate, export, name locking
 */

const ActivityEngine = (function() {
  'use strict';

  // ============================================
  // Configuration & State
  // ============================================

  let config = null;
  let state = null;
  let containerId = null;
  let courseTheme = 'cst395'; // 'cst395' (teal) or 'cst349' (indigo)
  let canvasAssignmentUrl = null;

  const STORAGE_PREFIX = 'activity_';

  // ============================================
  // Utility Functions
  // ============================================

  function isMobile() {
    // If viewport is wide enough, consider it desktop regardless of user agent
    // This prevents false positives in Canvas iframes on desktop
    if (window.innerWidth >= 768) {
      return false;
    }
    // For narrow viewports, check user agent to distinguish mobile from narrow desktop window
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  function getStorageKey() {
    return STORAGE_PREFIX + config.activityId + '_state';
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return null;
  }

  function saveState() {
    try {
      state.lastUpdatedAt = new Date().toISOString();
      localStorage.setItem(getStorageKey(), JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }

  function clearState() {
    try {
      localStorage.removeItem(getStorageKey());
    } catch (e) {
      console.warn('Failed to clear state from localStorage:', e);
    }
  }

  function createInitialState() {
    return {
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      responses: {},
      currentQuestionIndex: 0,
      name: null,
      partnerName: null,
      downloadedAt: null,
      device: {
        type: isMobile() ? 'mobile' : 'desktop',
        sawMobileWarning: false,
        continuedOnMobile: false
      }
    };
  }

  // ============================================
  // Mobile Gate
  // ============================================

  function showMobileGate(container, onContinue, onSwitch) {
    const themeColor = courseTheme === 'cst395' ? '#14b8a6' : '#6366f1';

    container.innerHTML = `
      <div class="activity-mobile-gate">
        <div class="activity-mobile-gate__content">
          <div class="activity-mobile-gate__icon">📱</div>
          <h2 class="activity-mobile-gate__title">You're on a mobile device</h2>
          <p class="activity-mobile-gate__text">
            This activity works best on a computer — larger screen helps with reading and interaction.
          </p>
          <p class="activity-mobile-gate__text" style="margin-top: 12px; font-weight: 500;">
            If you start here, you'll need to finish here.<br>
            Progress won't transfer to another device.
          </p>

          <div class="activity-mobile-gate__buttons">
            <button class="activity-mobile-gate__btn activity-mobile-gate__btn--primary" id="mobile-switch-btn">
              I'll switch to a computer
              <span class="activity-mobile-gate__btn-hint">(recommended)</span>
            </button>
            <button class="activity-mobile-gate__btn activity-mobile-gate__btn--secondary" id="mobile-continue-btn">
              Continue on mobile
              <span class="activity-mobile-gate__btn-hint">I understand I must finish here</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('mobile-switch-btn').addEventListener('click', onSwitch);
    document.getElementById('mobile-continue-btn').addEventListener('click', onContinue);
  }

  function showSwitchMessage(container) {
    const themeColor = courseTheme === 'cst395' ? '#14b8a6' : '#6366f1';

    container.innerHTML = `
      <div class="activity-mobile-gate">
        <div class="activity-mobile-gate__content">
          <div class="activity-mobile-gate__icon">💻</div>
          <h2 class="activity-mobile-gate__title">Great choice!</h2>
          <p class="activity-mobile-gate__text">
            Open this same link on your computer to begin the activity.
          </p>
          <p class="activity-mobile-gate__text" style="margin-top: 16px; font-size: 14px; color: #64748b;">
            Tip: Send yourself this URL or find it in your course materials.
          </p>
        </div>
      </div>
    `;
  }

  // ============================================
  // Activity Rendering
  // ============================================

  function renderActivity(container) {
    const themeColor = courseTheme === 'cst395' ? 'teal' : 'indigo';
    const roster = Array.isArray(config.roster) ? config.roster : [];
    const rosterPresent = roster.length > 0;

    // Build partner-selector HTML if a roster is configured. Some activities
    // (e.g. solo reflections) don't have a partner — those simply omit roster.
    const partnerSelectorHtml = rosterPresent ? `
      <section class="activity__partner-selector" id="activity-partner-selector">
        <label for="activity-partner-select" class="activity__partner-label">
          Whose responses are you entering? <span class="activity__partner-required">required</span>
        </label>
        <select id="activity-partner-select" class="activity__partner-select" autocomplete="off">
          <option value="">— Select your partner —</option>
          ${roster.map(name => `<option value="${escapeHtmlAttr(name)}">${escapeHtmlText(name)}</option>`).join('')}
        </select>
        <p class="activity__partner-hint">Pick the classmate whose written responses you're transcribing below. Your own name goes at the bottom of the page when you submit.</p>
      </section>
    ` : '';

    // Build student-name input. If a roster is configured, render a dropdown
    // (consistent data, no typos). Otherwise, fall back to free text.
    const studentNameInputHtml = rosterPresent ? `
      <select
        id="activity-name-input"
        class="activity__name-input"
        autocomplete="off"
      >
        <option value="">— Select your name —</option>
        ${roster.map(name => `<option value="${escapeHtmlAttr(name)}">${escapeHtmlText(name)}</option>`).join('')}
      </select>
    ` : `
      <input
        type="text"
        id="activity-name-input"
        class="activity__name-input"
        placeholder="Enter your full name"
        autocomplete="name"
      >
    `;

    container.innerHTML = `
      <div class="activity" data-theme="${themeColor}">
        <header class="activity__header">
          <div class="activity__badge">${config.course || 'Activity'}</div>
          <h1 class="activity__title">${config.title}</h1>
          ${config.description ? `<p class="activity__description">${config.description}</p>` : ''}
        </header>

        <div class="activity__progress">
          <div class="activity__progress-bar">
            <div class="activity__progress-fill" id="activity-progress-fill"></div>
          </div>
          <div class="activity__progress-text" id="activity-progress-text">
            Question 1 of ${config.questions.length}
          </div>
        </div>

        ${partnerSelectorHtml}

        <main class="activity__questions" id="activity-questions">
          <!-- Questions rendered here -->
        </main>

        <footer class="activity__footer" id="activity-footer">
          <div class="activity__submit-section">
            <h3 class="activity__submit-title">Ready to submit?</h3>
            <p class="activity__submit-text">${rosterPresent ? 'Pick your name, then copy your responses.' : 'Enter your name exactly as it appears in Canvas, then copy your responses.'}</p>

            <div class="activity__name-input-wrapper">
              <label for="activity-name-input" class="activity__name-label">Your Name</label>
              ${studentNameInputHtml}
            </div>

            <div class="activity__warning" id="activity-name-warning">
              <strong>Important:</strong> Make sure your name is correct before copying.
              If you change your name after copying, all responses will be cleared and you'll need to redo the activity.
            </div>

            <p class="activity__download-hint activity__download-hint--blocked" id="activity-download-hint">
              Still needed: complete your responses.
            </p>

            <button class="activity__download-btn" id="activity-download-btn" disabled>
              Copy responses for Google Doc
            </button>

            ${canvasAssignmentUrl ? `
              <a href="${canvasAssignmentUrl}" target="_blank" rel="noopener noreferrer" class="activity__canvas-link" id="activity-canvas-link">
                Submit on Canvas →
              </a>
            ` : ''}
          </div>
        </footer>

        <div class="activity__version">
          Activity v${config.version}${config.versionNotes ? ` — ${config.versionNotes}` : ''}
        </div>
      </div>
    `;

    // Set up name input listener
    const nameInput = document.getElementById('activity-name-input');
    const downloadBtn = document.getElementById('activity-download-btn');
    const partnerSelect = document.getElementById('activity-partner-select');

    function handleNameChange() {
      const name = nameInput.value.trim();

      // Check if name changed after copying (downloadedAt field retained for state compatibility)
      if (state.downloadedAt && state.name && name !== state.name) {
        if (confirm('Changing your name after copying will clear all your responses. You will need to redo the activity. Continue?')) {
          // Clear everything and restart
          clearState();
          state = createInitialState();
          state.device.sawMobileWarning = true;
          if (isMobile()) {
            state.device.continuedOnMobile = true;
          }
          saveState();
          renderActivity(container);
          renderQuestions();
          return;
        } else {
          // Restore original name
          nameInput.value = state.name;
        }
      }

      // Persist current draft of the name so partial typing survives reloads
      if (name.length >= 2) {
        state.name = name;
        saveState();
      }
      updateDownloadButtonState();
    }

    nameInput.addEventListener('input', handleNameChange);
    nameInput.addEventListener('change', handleNameChange);

    if (partnerSelect) {
      partnerSelect.addEventListener('change', () => {
        state.partnerName = partnerSelect.value || null;
        saveState();
        updateDownloadButtonState();
      });
      // Restore previously selected partner
      if (state.partnerName) {
        partnerSelect.value = state.partnerName;
      }
    }

    downloadBtn.addEventListener('click', handleDownload);

    // Restore name if previously entered
    if (state.name) {
      nameInput.value = state.name;
    }

    // Render questions
    renderQuestions();

    // Initial download button state (based on restored state)
    updateDownloadButtonState();
  }

  // Small HTML escapers used by renderActivity (separate from the engine
  // because activity-components.js has its own; we only need them here for
  // the roster-driven dropdowns to be safe against names with quotes / <).
  function escapeHtmlText(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  function escapeHtmlAttr(s) {
    return escapeHtmlText(s).replace(/"/g, '&quot;');
  }

  function renderQuestions() {
    const questionsContainer = document.getElementById('activity-questions');
    if (!questionsContainer) return;

    questionsContainer.innerHTML = '';

    // Build question config map for cross-question references (e.g., QFT sources)
    const questionConfigMap = {};
    config.questions.forEach(q => { questionConfigMap[q.id] = q; });

    config.questions.forEach((question, index) => {
      const questionEl = ActivityComponents.renderQuestion(question, index, {
        maxRetries: question.maxRetries || config.settings?.maxRetries || 5,
        showHintsAfterAttempt: question.showHintsAfterAttempt || config.settings?.showHintsAfterAttempt || 2,
        showExplanationAfterAttempt: question.showExplanationAfterAttempt || config.settings?.showExplanationAfterAttempt || 5,
        response: state.responses[question.id],
        onAnswer: (answer, isCorrect) => handleAnswer(question.id, answer, isCorrect),
        onSkip: () => handleSkip(question.id),
        courseTheme: courseTheme,
        aiEndpoint: config.settings?.aiEndpoint || null,
        getAllResponses: () => state.responses,
        questionConfig: questionConfigMap
      });
      questionsContainer.appendChild(questionEl);
    });

    updateProgress();
    checkCompletion();
  }

  function updateProgress() {
    // Count required vs optional separately so optional questions don't
    // drag down the progress bar or make the counter misleading.
    const requiredQuestions = config.questions.filter(q => !q.optional);
    const optionalQuestions = config.questions.filter(q => q.optional);

    const requiredAnswered = requiredQuestions.filter(q => state.responses[q.id]).length;
    const optionalAnswered = optionalQuestions.filter(q => state.responses[q.id]).length;

    const requiredTotal = requiredQuestions.length;
    const optionalTotal = optionalQuestions.length;

    const percent = requiredTotal > 0
      ? (requiredAnswered / requiredTotal) * 100
      : ((requiredAnswered + optionalAnswered) / config.questions.length) * 100;

    const progressFill = document.getElementById('activity-progress-fill');
    const progressText = document.getElementById('activity-progress-text');

    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }
    if (progressText) {
      if (optionalTotal > 0) {
        progressText.textContent = `${requiredAnswered} of ${requiredTotal} required · ${optionalAnswered} of ${optionalTotal} optional answered`;
      } else {
        progressText.textContent = `${requiredAnswered} of ${requiredTotal} questions answered`;
      }
    }
  }

  function checkCompletion() {
    // Footer is always visible — students can download at any time
    // This function is kept for future use (e.g., completion indicators)
  }

  // ============================================
  // Download Gating (require full responses before download)
  // ============================================

  /**
   * Determine whether a question has been "substantially" answered, based on
   * its type. Used to gate the Download button so students can't export an
   * empty/half-filled JSON. Optional questions are NEVER required.
   */
  function isQuestionSubstantiallyAnswered(question, response) {
    if (!response) return false;
    if (response.skipped) return false;
    var ans = response.answer;
    if (ans === null || ans === undefined) return false;

    switch (question.type) {
      case 'partner-entry': {
        var text = (ans && typeof ans === 'object') ? (ans.text || '') : '';
        var min = question.minLength || 1;
        return text.trim().length >= min;
      }
      case 'qft-discussion': {
        if (!ans || typeof ans !== 'object') return false;
        var qs = Array.isArray(ans.questions) ? ans.questions.filter(function(q) { return q && q.text && q.text.trim().length > 0; }) : [];
        var qftMin = question.qftMin || 3;
        if (qs.length < qftMin) return false;
        var notes = (ans.discussionNotes || '').trim();
        if (notes.length < 20) return false;
        return true;
      }
      case 'open-ended': {
        var v = (typeof ans === 'string') ? ans : '';
        var minOpen = question.minLength || 1;
        return v.trim().length >= minOpen;
      }
      case 'instructional':
        // Instructional sections never need an answer
        return true;
      default:
        // multiple-choice, fill-blank-*, match-following, ai-discussion, etc.
        return ans !== null && ans !== '';
    }
  }

  /**
   * Recompute whether the "Copy responses for Google Doc" button should be enabled.
   * Enabled iff: student name >= 2 chars AND partner selected (when roster
   * present) AND every required question is substantially answered.
   * Also surfaces a tooltip / hint message explaining what's still missing.
   */
  function updateDownloadButtonState() {
    var btn = document.getElementById('activity-download-btn');
    if (!btn) return;

    var nameInput = document.getElementById('activity-name-input');
    var partnerSelect = document.getElementById('activity-partner-select');
    var hint = document.getElementById('activity-download-hint');

    var name = nameInput ? nameInput.value.trim() : '';
    var partner = partnerSelect ? partnerSelect.value : (state.partnerName || '');
    var rosterPresent = Array.isArray(config.roster) && config.roster.length > 0;

    var missing = [];
    if (name.length < 2) missing.push('your name');
    if (rosterPresent && !partner) missing.push('your partner');

    var requiredQuestions = config.questions.filter(function(q) { return !q.optional && q.type !== 'instructional'; });
    var unansweredCount = 0;
    requiredQuestions.forEach(function(q) {
      if (!isQuestionSubstantiallyAnswered(q, state.responses[q.id])) {
        unansweredCount++;
      }
    });
    if (unansweredCount > 0) {
      missing.push(unansweredCount + ' unfinished question' + (unansweredCount === 1 ? '' : 's'));
    }

    var canDownload = missing.length === 0;
    btn.disabled = !canDownload;

    if (hint) {
      if (canDownload) {
        hint.textContent = 'All set — copy your responses.';
        hint.className = 'activity__download-hint activity__download-hint--ready';
      } else {
        hint.textContent = 'Still needed: ' + missing.join(', ') + '.';
        hint.className = 'activity__download-hint activity__download-hint--blocked';
      }
    }
  }

  // ============================================
  // Event Handlers
  // ============================================

  function handleAnswer(questionId, answer, isCorrect, isAutoSave) {
    if (!state.responses[questionId]) {
      state.responses[questionId] = {
        answer: null,
        attempts: 0,
        correct: null,
        skipped: false
      };
    }

    state.responses[questionId].answer = answer;
    // Autosave (debounced typing, blur events) shouldn't inflate the
    // attempts counter. Only explicit save-button clicks count as attempts.
    if (!isAutoSave) {
      state.responses[questionId].attempts++;
    }
    state.responses[questionId].correct = isCorrect;
    state.responses[questionId].skipped = false;

    saveState();
    updateProgress();
    checkCompletion();
    updateDownloadButtonState();
  }

  function handleSkip(questionId) {
    const skipNudgeMessage = config.settings?.skipNudgeMessage ||
      "This question reinforces an important concept. Are you sure you want to skip?";

    if (!state.responses[questionId]?.skipped) {
      if (!confirm(skipNudgeMessage)) {
        return false;
      }
    }

    if (!state.responses[questionId]) {
      state.responses[questionId] = {
        answer: null,
        attempts: 0,
        correct: null,
        skipped: true
      };
    } else {
      state.responses[questionId].skipped = true;
    }

    saveState();
    updateProgress();
    checkCompletion();
    return true;
  }

  function handleDownload() {
    const nameInput = document.getElementById('activity-name-input');
    const partnerSelect = document.getElementById('activity-partner-select');
    const name = nameInput.value.trim();

    if (name.length < 2) {
      alert('Please enter your full name.');
      return;
    }

    // Defensive: re-run the gate before exporting. The button should already
    // be disabled if anything is missing, but this guards against state drift.
    var requiredQuestions = config.questions.filter(function(q) { return !q.optional && q.type !== 'instructional'; });
    var missing = requiredQuestions.filter(function(q) { return !isQuestionSubstantiallyAnswered(q, state.responses[q.id]); });
    if (missing.length > 0) {
      alert('Please finish all required questions before copying. ' + missing.length + ' still needs work.');
      updateDownloadButtonState();
      return;
    }
    if (Array.isArray(config.roster) && config.roster.length > 0 && partnerSelect && !partnerSelect.value) {
      alert('Please select your partner from the dropdown at the top of the page before copying.');
      return;
    }

    // Save name, partner, and export timestamp. `downloadedAt` field name is retained
    // for localStorage backward compatibility; its meaning is now "export step completed at."
    state.name = name;
    if (partnerSelect) state.partnerName = partnerSelect.value || null;
    state.downloadedAt = new Date().toISOString();
    saveState();

    const exportData = generateExport();
    const btn = document.getElementById('activity-download-btn');

    copyMarkdownToClipboard(exportData.markdown)
      .then(function() {
        showExportModal(exportData, name, true);
      })
      .catch(function() {
        showExportModal(exportData, name, false);
      });

    // Lock the form regardless of clipboard outcome — the modal handles fallback copying.
    nameInput.disabled = true;
    btn.textContent = 'Copied ✓';
    btn.disabled = true;
  }

  function copyMarkdownToClipboard(markdown) {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(markdown);
    }
    return Promise.reject(new Error('Clipboard API unavailable'));
  }

  function downloadJsonBackup(exportData, name) {
    const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = jsonUrl;
    link.download = `${config.activityId}_${name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(jsonUrl);
  }

  function showExportModal(exportData, name, copied) {
    // Remove any prior modal (defensive: re-entrancy if the user clicks the main button twice)
    const existing = document.getElementById('activity-export-modal');
    if (existing) existing.parentNode.removeChild(existing);

    const overlay = document.createElement('div');
    overlay.id = 'activity-export-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';

    const card = document.createElement('div');
    card.style.cssText = 'background:white;border-radius:12px;max-width:720px;width:100%;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,0.3);position:relative;max-height:90vh;overflow-y:auto;';

    const heading = copied ? 'Copied to clipboard ✓' : 'Copy your responses';
    const fallbackNote = copied
      ? ''
      : '<p style="margin:0 0 12px 0;padding:10px 14px;background:#fef3c7;border:1px solid #fcd34d;border-radius:6px;font-size:13px;color:#92400e;">Your browser blocked automatic copy — press <strong>Cmd/Ctrl+C</strong> to copy the selected text below.</p>';

    card.innerHTML =
      '<button type="button" id="activity-export-modal-close" aria-label="Close" style="position:absolute;top:12px;right:12px;background:transparent;border:none;font-size:24px;line-height:1;color:#6b7280;cursor:pointer;padding:4px 8px;">&times;</button>' +
      '<h2 style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#0f172a;">' + heading + '</h2>' +
      fallbackNote +
      '<textarea id="activity-export-modal-textarea" readonly rows="15" style="width:100%;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;line-height:1.5;padding:12px;border:1px solid #e2e8f0;border-radius:8px;resize:vertical;box-sizing:border-box;"></textarea>' +
      '<p style="margin:12px 0 16px 0;font-size:14px;color:#334155;">Now paste into your Sprint 4 Google Doc (Cmd/Ctrl+V) and export as PDF.</p>' +
      '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">' +
        '<button type="button" id="activity-export-modal-copy" style="background:#14b8a6;color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Copy again</button>' +
        '<span id="activity-export-modal-flash" style="font-size:13px;color:#0f766e;font-weight:600;opacity:0;transition:opacity 0.2s;">Copied ✓</span>' +
        '<a href="#" id="activity-export-modal-json" style="margin-left:auto;font-size:13px;color:#64748b;text-decoration:underline;">Download JSON backup</a>' +
      '</div>';

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const textarea = document.getElementById('activity-export-modal-textarea');
    textarea.value = exportData.markdown;

    if (!copied) {
      // Auto-select so Cmd/Ctrl+C is the only remaining step in fallback mode.
      textarea.focus();
      textarea.select();
    }

    function closeModal() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.removeEventListener('keydown', onKeydown);
    }
    function onKeydown(e) {
      if (e.key === 'Escape') closeModal();
    }

    document.getElementById('activity-export-modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', onKeydown);

    const flash = document.getElementById('activity-export-modal-flash');
    document.getElementById('activity-export-modal-copy').addEventListener('click', function() {
      copyMarkdownToClipboard(exportData.markdown)
        .then(function() {
          flash.style.opacity = '1';
          setTimeout(function() { flash.style.opacity = '0'; }, 1500);
        })
        .catch(function() {
          textarea.focus();
          textarea.select();
        });
    });

    document.getElementById('activity-export-modal-json').addEventListener('click', function(e) {
      e.preventDefault();
      downloadJsonBackup(exportData, name);
    });
  }

  // ============================================
  // Export Generation
  // ============================================

  function generateExport() {
    const responses = [];
    let totalAttempts = 0;
    let correctOnFirst = 0;
    let attempted = 0;
    let skipped = 0;

    config.questions.forEach(question => {
      const response = state.responses[question.id];

      if (response) {
        attempted++;
        totalAttempts += response.attempts || 0;

        if (response.skipped) {
          skipped++;
        } else if (response.correct && response.attempts === 1) {
          correctOnFirst++;
        }

        responses.push({
          questionId: question.id,
          questionType: question.type,
          answer: response.answer,
          attempts: response.attempts,
          correct: response.correct,
          skipped: response.skipped
        });
      } else {
        responses.push({
          questionId: question.id,
          questionType: question.type,
          answer: null,
          attempts: 0,
          correct: null,
          skipped: false,
          notAttempted: true
        });
      }
    });

    return {
      // Metadata
      activityId: config.activityId,
      version: config.version,
      versionNotes: config.versionNotes || null,
      course: config.course || null,

      // Student info
      studentName: state.name,
      partnerName: state.partnerName || null,
      authorName: state.authorName || state.partnerName || null,
      submittedAt: state.downloadedAt,

      // Device info
      device: state.device,

      // Timing
      startedAt: state.startedAt,

      // Responses
      responses: responses,

      // Summary
      summary: {
        totalQuestions: config.questions.length,
        attempted: attempted,
        skipped: skipped,
        correctOnFirst: correctOnFirst,
        totalAttempts: totalAttempts
      },

      // Markdown version for human readability
      markdown: generateMarkdown(responses)
    };
  }

  function generateMarkdown(responses) {
    let md = `# ${config.title}\n\n`;
    md += `**Student:** ${state.name}\n`;
    if (state.partnerName) {
      md += `**Partner:** ${state.partnerName}\n`;
    } else if (state.authorName) {
      md += `**Author:** ${state.authorName}\n`;
    }
    md += `**Submitted:** ${new Date(state.downloadedAt).toLocaleString()}\n`;
    md += `**Activity Version:** ${config.version}\n`;
    if (state.device.type === 'mobile') {
      md += `**Device:** Mobile\n`;
    }
    md += `\n---\n\n`;
    md += `## Responses\n\n`;

    config.questions.forEach((question, index) => {
      const response = state.responses[question.id];

      // Instructional sections are read-only — render the heading without
      // a "Q" prefix or response quote, since there's no student answer.
      if (question.type === 'instructional') {
        const heading = question.sectionTitle || question.prompt || 'Instruction';
        md += `### ${index + 1}. ${heading}\n\n`;
        md += `*(Read-only section — no response required)*\n\n`;
        return;
      }

      const optionalTag = question.optional ? ' *(optional)*' : '';
      md += `### Q${index + 1}: ${question.sectionTitle || question.prompt || question.template || 'Question'}${optionalTag}\n\n`;

      if (!response || response.skipped) {
        md += question.optional ? `*Skipped (optional)*\n\n` : `*Skipped*\n\n`;
      } else if (response.answer === null) {
        md += question.optional ? `*Not attempted (optional)*\n\n` : `*Not attempted*\n\n`;
      } else {
        if (question.type === 'open-ended') {
          md += `> ${response.answer}\n\n`;
        } else if (question.type === 'multiple-choice') {
          const selectedOption = question.options[response.answer];
          md += `**Answer:** ${selectedOption} ${response.correct ? '✓' : '✗'}\n`;
          md += `**Attempts:** ${response.attempts}\n\n`;
        } else if (question.type === 'ai-discussion') {
          const a = response.answer;
          md += `**Response:**\n> ${a.enteredResponse || 'N/A'}\n\n`;
          if (a.aiQuestions && a.aiQuestions.length > 0) {
            md += `**AI-Generated Follow-up Questions:**\n`;
            a.aiQuestions.forEach((q, i) => { md += `${i + 1}. ${q}\n`; });
            md += `\n`;
          }
          md += `**Refined Response:**\n> ${a.discussionSummary || 'N/A'}\n\n`;
          if (a.iterations && a.iterations > 1) {
            md += `**AI Guidance Rounds:** ${a.iterations}\n\n`;
          }
        } else if (question.type === 'partner-entry') {
          const a = response.answer;
          if (a.selectedPrompt && a.selectedPrompt !== question.prompt) {
            md += `**Selected question:** ${a.selectedPrompt}\n\n`;
          }
          md += `**Response:**\n> ${a.text || 'N/A'}\n\n`;
        } else if (question.type === 'qft-discussion') {
          const a = response.answer;
          if (a.questions && a.questions.length > 0) {
            md += `**Follow-up Questions:**\n`;
            a.questions.forEach((q, i) => { md += `${i + 1}. [${(q.type || 'open').toUpperCase()}] ${q.text}\n`; });
            md += `\n`;
          }
          if (a.aiFeedback) {
            md += `**AI Assessment:** ${a.aiFeedback.assessment || 'N/A'}\n`;
            md += `**AI Feedback:** ${a.aiFeedback.overallFeedback || 'N/A'}\n\n`;
          }
          md += `**Discussion Notes:**\n> ${a.discussionNotes || 'N/A'}\n\n`;
        } else if (question.type === 'match-following') {
          md += `**Matches:** ${JSON.stringify(response.answer)}\n`;
          md += `**Attempts:** ${response.attempts}\n\n`;
        } else {
          md += `**Answer:** ${JSON.stringify(response.answer)}\n`;
          md += `**Attempts:** ${response.attempts}\n\n`;
        }
      }
    });

    md += `---\n\n`;
    md += `*Activity ID: ${config.activityId} | Version: ${config.version}*\n`;

    return md;
  }

  // ============================================
  // Public API
  // ============================================

  return {
    /**
     * Initialize the activity engine
     * @param {Object} options - Configuration options
     * @param {string} options.containerId - ID of container element
     * @param {string} options.configUrl - URL to activity config JSON
     * @param {string} options.courseTheme - 'cst395' or 'cst349'
     * @param {string} options.canvasUrl - Optional Canvas assignment URL
     */
    async init(options) {
      containerId = options.containerId;
      courseTheme = options.courseTheme || 'cst395';
      canvasAssignmentUrl = options.canvasUrl || null;

      const container = document.getElementById(containerId);
      if (!container) {
        console.error('Activity container not found:', containerId);
        return;
      }

      // Show loading state
      container.innerHTML = '<div class="activity-loading">Loading activity...</div>';

      try {
        // Load config
        const response = await fetch(options.configUrl);
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.status}`);
        }
        config = await response.json();

        // Load or create state
        state = loadState() || createInitialState();

        // Check mobile gate
        if (isMobile() && !state.device.sawMobileWarning) {
          showMobileGate(
            container,
            // Continue on mobile
            () => {
              state.device.sawMobileWarning = true;
              state.device.continuedOnMobile = true;
              state.device.type = 'mobile';
              saveState();
              renderActivity(container);
            },
            // Switch to computer
            () => {
              showSwitchMessage(container);
            }
          );
        } else {
          renderActivity(container);
        }

      } catch (error) {
        console.error('Failed to initialize activity:', error);
        container.innerHTML = `
          <div class="activity-error">
            <h2>Failed to load activity</h2>
            <p>${error.message}</p>
            <button onclick="location.reload()">Try Again</button>
          </div>
        `;
      }
    },

    /**
     * Get current state (for debugging)
     */
    getState() {
      return { config, state };
    },

    /**
     * Clear state and restart (for debugging)
     */
    reset() {
      clearState();
      location.reload();
    },

    /**
     * Exposed for test harnesses. Internal use only — the UI path runs this via
     * handleDownload() when the student clicks "Copy responses for Google Doc".
     */
    _copyMarkdownToClipboard(markdown) {
      return copyMarkdownToClipboard(markdown);
    }
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ActivityEngine;
}

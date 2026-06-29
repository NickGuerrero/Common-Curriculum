/**
 * Activity Components
 * Renderers for different question types
 */

const ActivityComponents = (function() {
  'use strict';

  // ============================================
  // Utility Functions
  // ============================================

  function createElement(tag, className, innerHTML) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
  }

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // ============================================
  // Question Wrapper
  // ============================================

  function renderQuestion(question, index, options) {
    const wrapper = createElement('div', 'activity-question');
    wrapper.setAttribute('data-question-id', question.id);
    wrapper.setAttribute('data-question-type', question.type);

    if (question.optional) {
      wrapper.setAttribute('data-optional', 'true');
    }

    const header = createElement('div', 'activity-question__header');
    header.innerHTML = `
      <div class="activity-question__header-left">
        <span class="activity-question__number">Q${index + 1}</span>
        ${question.optional ? '<span class="activity-question__optional-chip">Optional</span>' : ''}
      </div>
      <span class="activity-question__status" id="status-${question.id}"></span>
    `;
    wrapper.appendChild(header);

    // Render optional info block above the question
    if (question.infoBlock) {
      const infoEl = createElement('div', 'activity-question__info-block');
      infoEl.innerHTML = question.infoBlock;
      wrapper.appendChild(infoEl);
    }

    // Render based on type
    let content;
    switch (question.type) {
      case 'multiple-choice':
        content = renderMultipleChoice(question, options);
        break;
      case 'open-ended':
        content = renderOpenEnded(question, options);
        break;
      case 'fill-blank-text':
        content = renderFillBlankText(question, options);
        break;
      case 'fill-blank-dropdown':
        content = renderFillBlankDropdown(question, options);
        break;
      case 'match-following':
        content = renderMatchFollowing(question, options);
        break;
      case 'ai-discussion':
        content = renderAiDiscussion(question, options);
        break;
      case 'partner-entry':
        content = renderPartnerEntry(question, options);
        break;
      case 'qft-discussion':
        content = renderQftDiscussion(question, options);
        break;
      case 'instructional':
        content = renderInstructional(question, options);
        break;
      default:
        content = createElement('div', 'activity-question__error', `Unknown question type: ${question.type}`);
    }

    wrapper.appendChild(content);

    // Update status if already answered
    if (options.response) {
      updateQuestionStatus(question.id, options.response);
    }

    return wrapper;
  }

  function updateQuestionStatus(questionId, response) {
    const statusEl = document.getElementById(`status-${questionId}`);
    if (!statusEl) return;

    if (response.skipped) {
      statusEl.textContent = 'Skipped';
      statusEl.className = 'activity-question__status activity-question__status--skipped';
    } else if (response.correct === true) {
      statusEl.textContent = '✓ Correct';
      statusEl.className = 'activity-question__status activity-question__status--correct';
    } else if (response.correct === false) {
      statusEl.textContent = `Attempt ${response.attempts}`;
      statusEl.className = 'activity-question__status activity-question__status--incorrect';
    } else if (response.answer !== null) {
      // Open-ended or other non-graded
      statusEl.textContent = '✓ Answered';
      statusEl.className = 'activity-question__status activity-question__status--answered';
    }
  }

  // ============================================
  // Multiple Choice
  // ============================================

  function renderMultipleChoice(question, options) {
    const container = createElement('div', 'activity-question__content activity-mc');

    const prompt = createElement('p', 'activity-question__prompt', question.prompt);
    container.appendChild(prompt);

    const optionsContainer = createElement('div', 'activity-mc__options');

    question.options.forEach((optionText, optIndex) => {
      const optionBtn = createElement('button', 'activity-mc__option');
      optionBtn.setAttribute('data-index', optIndex);
      optionBtn.innerHTML = `
        <span class="activity-mc__option-letter">${String.fromCharCode(65 + optIndex)}</span>
        <span class="activity-mc__option-text">${optionText}</span>
      `;

      // Restore state if previously answered
      if (options.response && options.response.answer === optIndex) {
        optionBtn.classList.add('activity-mc__option--selected');
        if (options.response.correct) {
          optionBtn.classList.add('activity-mc__option--correct');
        } else {
          optionBtn.classList.add('activity-mc__option--incorrect');
        }
      }

      optionBtn.addEventListener('click', () => {
        handleMultipleChoiceSelect(question, optIndex, optionBtn, optionsContainer, options);
      });

      optionsContainer.appendChild(optionBtn);
    });

    container.appendChild(optionsContainer);

    // Hint area (shown after X attempts)
    const hintArea = createElement('div', 'activity-question__hint', '');
    hintArea.id = `hint-${question.id}`;
    hintArea.style.display = 'none';
    container.appendChild(hintArea);

    // Explanation area (shown after correct or max attempts)
    const explainArea = createElement('div', 'activity-question__explanation', '');
    explainArea.id = `explain-${question.id}`;
    explainArea.style.display = 'none';
    container.appendChild(explainArea);

    // Show hint/explanation if already attempted enough
    if (options.response && question.hint) {
      if (options.response.attempts >= options.showHintsAfterAttempt && !options.response.correct) {
        hintArea.innerHTML = `<strong>Hint:</strong> ${question.hint}`;
        hintArea.style.display = 'block';
      }
    }
    if (options.response && question.explanation) {
      if (options.response.correct || options.response.attempts >= options.showExplanationAfterAttempt) {
        explainArea.innerHTML = `<strong>Explanation:</strong> ${question.explanation}`;
        explainArea.style.display = 'block';
      }
    }

    // Skip button
    const skipBtn = createElement('button', 'activity-question__skip', 'Skip this question');
    if (options.response?.correct || options.response?.skipped) {
      skipBtn.style.display = 'none';
    }
    skipBtn.addEventListener('click', () => {
      if (options.onSkip()) {
        skipBtn.style.display = 'none';
        updateQuestionStatus(question.id, { skipped: true });
      }
    });
    container.appendChild(skipBtn);

    return container;
  }

  function handleMultipleChoiceSelect(question, selectedIndex, selectedBtn, optionsContainer, options) {
    // Don't allow changes if already correct or at max retries
    const currentResponse = options.response || { attempts: 0, correct: false };
    if (currentResponse.correct) return;
    if (currentResponse.attempts >= options.maxRetries) return;

    // Check answer
    const isCorrect = selectedIndex === question.correctIndex;

    // Update UI
    optionsContainer.querySelectorAll('.activity-mc__option').forEach(btn => {
      btn.classList.remove('activity-mc__option--selected', 'activity-mc__option--incorrect');
    });
    selectedBtn.classList.add('activity-mc__option--selected');

    if (isCorrect) {
      selectedBtn.classList.add('activity-mc__option--correct');
      // Show explanation
      if (question.explanation) {
        const explainArea = document.getElementById(`explain-${question.id}`);
        if (explainArea) {
          explainArea.innerHTML = `<strong>Explanation:</strong> ${question.explanation}`;
          explainArea.style.display = 'block';
        }
      }
      // Hide skip button
      const skipBtn = selectedBtn.closest('.activity-question__content').querySelector('.activity-question__skip');
      if (skipBtn) skipBtn.style.display = 'none';
    } else {
      selectedBtn.classList.add('activity-mc__option--incorrect');

      const newAttempts = (currentResponse.attempts || 0) + 1;

      // Show hint after threshold
      if (question.hint && newAttempts >= options.showHintsAfterAttempt) {
        const hintArea = document.getElementById(`hint-${question.id}`);
        if (hintArea) {
          hintArea.innerHTML = `<strong>Hint:</strong> ${question.hint}`;
          hintArea.style.display = 'block';
        }
      }

      // Show explanation and correct answer after max attempts
      if (newAttempts >= options.maxRetries) {
        if (question.explanation) {
          const explainArea = document.getElementById(`explain-${question.id}`);
          if (explainArea) {
            explainArea.innerHTML = `<strong>Explanation:</strong> ${question.explanation}`;
            explainArea.style.display = 'block';
          }
        }
        // Highlight correct answer
        const correctBtn = optionsContainer.querySelector(`[data-index="${question.correctIndex}"]`);
        if (correctBtn) {
          correctBtn.classList.add('activity-mc__option--correct');
        }
      }
    }

    // Notify engine
    options.response = {
      answer: selectedIndex,
      attempts: (currentResponse.attempts || 0) + 1,
      correct: isCorrect,
      skipped: false
    };
    options.onAnswer(selectedIndex, isCorrect);
    updateQuestionStatus(question.id, options.response);
  }

  // ============================================
  // Open Ended
  // ============================================

  function renderOpenEnded(question, options) {
    const container = createElement('div', 'activity-question__content activity-open');

    // Skip the visible prompt paragraph when the question text already appears in
    // the infoBlock (set hidePrompt:true). prompt is still kept for AI sparring + export.
    if (question.prompt && !question.hidePrompt) {
      const prompt = createElement('p', 'activity-question__prompt', question.prompt);
      container.appendChild(prompt);
    }

    const textarea = document.createElement('textarea');
    textarea.className = 'activity-open__textarea';
    textarea.placeholder = question.placeholder || 'Type your response here...';
    textarea.rows = 5;

    // Restore state
    if (options.response && options.response.answer) {
      textarea.value = options.response.answer;
    }

    container.appendChild(textarea);

    // Character count
    const minLength = question.minLength || 0;
    const charCount = createElement('div', 'activity-open__charcount');
    charCount.innerHTML = `<span id="charcount-${question.id}">${textarea.value.length}</span> characters${minLength ? ` (minimum ${minLength})` : ''}`;
    container.appendChild(charCount);

    // Save button (suppressed when options.hideSaveButton is true — autosave
    // already persists state; the sparring/feedback button below acts as the
    // single affordance per question)
    const saveBtn = createElement('button', 'activity-open__save', 'Save Response');
    if (options.response?.answer) {
      saveBtn.textContent = 'Update Response';
    }

    // Debounced autosave: persists a draft on every keystroke (600ms after
    // last input) and on blur. Doesn't enforce minLength and doesn't bump
    // the attempts counter — that's reserved for the explicit Save click.
    let openAutosaveTimer = null;
    function openAutosave() {
      if (openAutosaveTimer) clearTimeout(openAutosaveTimer);
      openAutosaveTimer = setTimeout(function() {
        if (typeof options.onAnswer === 'function') {
          options.onAnswer(textarea.value.trim(), null, true);
        }
        // With hideSaveButton on, autosave is the only persistence path —
        // mirror the visual "saved" feedback the explicit Save button used to
        // provide so the student gets a clear signal once minLength is met.
        if (options.hideSaveButton && (!minLength || textarea.value.trim().length >= minLength)) {
          updateQuestionStatus(question.id, { answer: textarea.value.trim(), attempts: 1, correct: null, skipped: false });
        }
      }, 600);
    }

    textarea.addEventListener('input', () => {
      const count = textarea.value.length;
      document.getElementById(`charcount-${question.id}`).textContent = count;

      // Visual feedback for minimum length
      if (minLength && count < minLength) {
        charCount.classList.add('activity-open__charcount--insufficient');
      } else {
        charCount.classList.remove('activity-open__charcount--insufficient');
      }

      openAutosave();
    });
    textarea.addEventListener('blur', openAutosave);

    saveBtn.addEventListener('click', () => {
      const value = textarea.value.trim();

      if (minLength && value.length < minLength) {
        alert(`Please write at least ${minLength} characters.`);
        return;
      }

      options.onAnswer(value, null); // null for correct since open-ended isn't auto-graded
      saveBtn.textContent = 'Saved ✓';
      setTimeout(() => {
        saveBtn.textContent = 'Update Response';
      }, 2000);

      updateQuestionStatus(question.id, { answer: value, attempts: 1, correct: null, skipped: false });
    });

    if (!options.hideSaveButton) {
      container.appendChild(saveBtn);
    }

    // --- AI Sparring Partner panel (opt-in via question.aiSparringPartner) ---
    // When configured, shows a "Think this through with AI" button that opens
    // an inline conversation where the AI acts as a reflection sparring partner:
    // asking questions back, never writing the student's answer, pushing toward
    // harder honesty. If aiSparringPartner is set, the default AI Feedback button
    // below is suppressed to avoid confusing dual-button UI.
    if (question.aiSparringPartner) {
      const sparringPanel = renderSparringPartner(question, textarea, options);
      container.appendChild(sparringPanel);
      return container;
    }

    // --- AI Feedback button (optional, shows when 50+ chars) ---
    const aiFeedbackBtn = createElement('button', 'activity-open__ai-feedback-btn', 'Get AI Feedback');
    aiFeedbackBtn.style.display = 'none';
    aiFeedbackBtn.style.marginTop = '8px';
    aiFeedbackBtn.style.background = 'transparent';
    aiFeedbackBtn.style.border = '1px solid #94a3b8';
    aiFeedbackBtn.style.color = '#94a3b8';
    aiFeedbackBtn.style.padding = '8px 16px';
    aiFeedbackBtn.style.borderRadius = '6px';
    aiFeedbackBtn.style.cursor = 'pointer';
    aiFeedbackBtn.style.fontSize = '14px';

    const aiFeedbackBox = createElement('div', 'activity-open__ai-feedback-box');
    aiFeedbackBox.style.display = 'none';
    aiFeedbackBox.style.marginTop = '12px';
    aiFeedbackBox.style.padding = '16px';
    aiFeedbackBox.style.background = '#f0f9ff';
    aiFeedbackBox.style.border = '1px solid #bae6fd';
    aiFeedbackBox.style.borderRadius = '8px';
    aiFeedbackBox.style.fontSize = '14px';
    aiFeedbackBox.style.lineHeight = '1.6';
    aiFeedbackBox.style.color = '#1e293b';

    // Show/hide AI feedback button based on char count
    const updateAiFeedbackVisibility = () => {
      aiFeedbackBtn.style.display = textarea.value.length >= 150 ? 'inline-block' : 'none';
    };
    textarea.addEventListener('input', updateAiFeedbackVisibility);
    updateAiFeedbackVisibility();

    aiFeedbackBtn.addEventListener('click', async () => {
      const text = textarea.value.trim();
      if (text.length < 150) return;

      aiFeedbackBtn.disabled = true;
      aiFeedbackBtn.textContent = 'Getting feedback...';
      aiFeedbackBox.style.display = 'block';
      aiFeedbackBox.textContent = 'Thinking...';

      const aiEndpoint = question.aiEndpoint ||
        options.aiEndpoint ||
        'https://ai-assisted-pedagogy.netlify.app/.netlify/functions/ai-proxy';

      try {
        const resp = await fetch(aiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: 'You are a supportive educational coach. Give constructive, encouraging feedback on this student reflection to help deepen their thinking. Do NOT grade or score. Ask 1-2 follow-up questions that could help them reflect more deeply. Keep your response to 3-4 sentences.',
            messages: [{ role: 'user', content: `Question prompt: ${question.prompt}\n\nStudent response: ${text}` }],
            max_tokens: 300,
          }),
        });

        if (!resp.ok) throw new Error(`Request failed (${resp.status})`);
        const data = await resp.json();
        aiFeedbackBox.innerHTML = `<strong>AI Feedback:</strong><br>${escapeHtml(data.content || data.text || '')}`;
      } catch (err) {
        aiFeedbackBox.innerHTML = `<em>Could not get feedback right now. Try again later.</em>`;
      }

      aiFeedbackBtn.disabled = false;
      aiFeedbackBtn.textContent = 'Get AI Feedback';
    });

    container.appendChild(aiFeedbackBtn);
    container.appendChild(aiFeedbackBox);

    return container;
  }

  // ============================================
  // Instructional (read-only, no input)
  // ============================================

  function renderInstructional(question, options) {
    const container = createElement('div', 'activity-question__content activity-instructional');

    if (question.prompt) {
      const prompt = createElement('p', 'activity-question__prompt activity-instructional__prompt', question.prompt);
      container.appendChild(prompt);
    }

    // Auto-mark as answered so progress counter reflects that this section
    // has been reached. The student doesn't need to click anything.
    if (!options.response || options.response.answer === null) {
      // Defer so engine bindings are ready
      setTimeout(() => {
        if (options.onAnswer) {
          options.onAnswer('(read)', null);
        }
      }, 0);
    }

    return container;
  }

  // ============================================
  // AI Sparring Partner (opt-in inline conversation)
  // ============================================
  //
  // Attaches a secondary button + expandable panel next to an open-ended
  // textarea. Clicking the button opens a multi-turn conversation with the
  // AI, configured via a sparring-partner system prompt to ask questions
  // back rather than produce answers. Conversation history lives in memory
  // only — it is not persisted to student state or the export (the student's
  // final typed answer in the main textarea is what gets saved).

  const DEFAULT_SPARRING_SYSTEM_PROMPT =
    "You are a reflection sparring partner helping a student look back on an assignment they already completed. " +
    "Your job is to help them think more honestly — NOT to write their answer for them. " +
    "Rules you must follow:\n" +
    "1. Ask questions back. Never supply the student's answer, draft sentences for them, or give templates they could paste in.\n" +
    "2. Push toward harder honesty, not easier framing. When you notice hedging, vague language, self-flattering conclusions, or the comfortable answer, gently call it out and ask a sharper question.\n" +
    "3. Be a thinking partner, not an answer generator. Short, focused, Socratic. Keep each response to 2-4 sentences with at most 2 questions.\n" +
    "4. Don't list bullet points of possible answers, don't offer frameworks, don't summarize their thinking back to them at length. Your value is the question, not the content.\n" +
    "5. If the student tries to get you to write their answer, decline warmly and redirect with a question.\n" +
    "6. Tone: warm, direct, curious. Not soft, not preachy.";

  function renderSparringPartner(question, textarea, options) {
    const spConfig = (typeof question.aiSparringPartner === 'object' && question.aiSparringPartner !== null)
      ? question.aiSparringPartner
      : {};
    const buttonLabel = spConfig.buttonLabel || 'Think this through with AI';
    const systemPrompt = spConfig.systemPrompt || DEFAULT_SPARRING_SYSTEM_PROMPT;
    const hideOptionalHint = !!spConfig.hideOptionalHint;

    const wrapper = createElement('div', 'activity-sparring');

    const toggleBtn = createElement('button', 'activity-sparring__toggle-btn');
    toggleBtn.type = 'button';
    toggleBtn.innerHTML = '<span class="activity-sparring__toggle-icon">&#9776;</span> ' + escapeHtml(buttonLabel) + (hideOptionalHint ? '' : ' <span class="activity-sparring__toggle-hint">(optional)</span>');

    const panel = createElement('div', 'activity-sparring__panel');
    panel.style.display = 'none';

    const header = createElement('div', 'activity-sparring__header');
    header.innerHTML =
      '<div class="activity-sparring__header-title">Sparring partner</div>' +
      '<div class="activity-sparring__header-sub">Asks questions back. Will not write your answer for you. Close anytime — nothing from this conversation is saved or submitted.</div>';
    panel.appendChild(header);

    const history = createElement('div', 'activity-sparring__history');
    panel.appendChild(history);

    const loading = createElement('div', 'activity-sparring__loading');
    loading.style.display = 'none';
    loading.innerHTML = '<span class="activity-sparring__spinner"></span> Thinking...';
    panel.appendChild(loading);

    const errorEl = createElement('div', 'activity-sparring__error');
    errorEl.style.display = 'none';
    panel.appendChild(errorEl);

    const inputRow = createElement('div', 'activity-sparring__input-row');
    const replyInput = document.createElement('textarea');
    replyInput.className = 'activity-sparring__reply-input';
    replyInput.rows = 2;
    replyInput.placeholder = 'Reply to the sparring partner...';
    inputRow.appendChild(replyInput);

    const sendBtn = createElement('button', 'activity-sparring__send-btn', 'Send');
    sendBtn.type = 'button';
    inputRow.appendChild(sendBtn);
    panel.appendChild(inputRow);

    const closeBtn = createElement('button', 'activity-sparring__close-btn', 'Close conversation');
    closeBtn.type = 'button';
    panel.appendChild(closeBtn);

    wrapper.appendChild(toggleBtn);
    wrapper.appendChild(panel);

    // Conversation state is in-memory only
    let messages = []; // { role: 'user'|'assistant', content: string }
    let started = false;

    function appendBubble(role, content) {
      const bubble = createElement('div', 'activity-sparring__bubble activity-sparring__bubble--' + role);
      const labelText = role === 'user' ? 'You' : 'Sparring partner';
      bubble.innerHTML = '<div class="activity-sparring__bubble-label">' + labelText + '</div>' +
        '<div class="activity-sparring__bubble-content">' + escapeHtml(content).replace(/\n/g, '<br>') + '</div>';
      history.appendChild(bubble);
      history.scrollTop = history.scrollHeight;
    }

    async function sendToAi(userMessage, isOpening) {
      loading.style.display = 'flex';
      errorEl.style.display = 'none';
      sendBtn.disabled = true;
      replyInput.disabled = true;

      const aiEndpoint = question.aiEndpoint ||
        options.aiEndpoint ||
        'https://ai-assisted-pedagogy.netlify.app/.netlify/functions/ai-proxy';

      // Build conversation history for the API
      const apiMessages = [];
      if (isOpening) {
        // First turn: frame the conversation with the question prompt + student's draft
        const draft = textarea.value.trim();
        const openingContent =
          'The reflection question the student is thinking about:\n"' + (question.prompt || '') + '"\n\n' +
          (draft
            ? 'The student\'s current draft answer:\n"""\n' + draft + '\n"""\n\nAsk 1-2 probing questions that push them toward more honest, specific self-assessment. Do not rewrite their draft or suggest wording.'
            : 'The student has not written a draft yet. Ask 1-2 opening questions to help them start thinking honestly about this. Do not offer template answers.');
        apiMessages.push({ role: 'user', content: openingContent });
      } else {
        // Subsequent turns: replay the conversation
        // First message establishes context; rest is the dialogue
        const draft = textarea.value.trim();
        const contextMsg =
          'The reflection question the student is thinking about:\n"' + (question.prompt || '') + '"\n\n' +
          (draft ? 'The student\'s current draft answer:\n"""\n' + draft + '\n"""' : 'The student has not written a draft yet.');
        apiMessages.push({ role: 'user', content: contextMsg });
        messages.forEach(m => apiMessages.push({ role: m.role, content: m.content }));
        apiMessages.push({ role: 'user', content: userMessage });
      }

      try {
        const resp = await fetch(aiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: systemPrompt,
            messages: apiMessages,
            max_tokens: 350,
          }),
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData.error || ('Request failed (' + resp.status + ')'));
        }

        const data = await resp.json();
        const aiText = (data.content || data.text || '').trim();
        if (!aiText) {
          throw new Error('Empty response from AI');
        }

        if (!isOpening) {
          messages.push({ role: 'user', content: userMessage });
        }
        messages.push({ role: 'assistant', content: aiText });
        if (!isOpening) {
          appendBubble('user', userMessage);
        }
        appendBubble('assistant', aiText);
      } catch (err) {
        console.error('Sparring partner error:', err);
        errorEl.textContent = 'Could not reach the sparring partner right now. You can try again, or just keep going on your own.';
        errorEl.style.display = 'block';
      } finally {
        loading.style.display = 'none';
        sendBtn.disabled = false;
        replyInput.disabled = false;
        replyInput.focus();
      }
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = panel.style.display !== 'none';
      if (isOpen) {
        panel.style.display = 'none';
        toggleBtn.classList.remove('activity-sparring__toggle-btn--active');
        return;
      }
      panel.style.display = 'block';
      toggleBtn.classList.add('activity-sparring__toggle-btn--active');
      if (!started) {
        started = true;
        sendToAi(null, true);
      }
    });

    sendBtn.addEventListener('click', () => {
      const userMessage = replyInput.value.trim();
      if (!userMessage) return;
      replyInput.value = '';
      sendToAi(userMessage, false);
    });

    replyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        sendBtn.click();
      }
    });

    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
      toggleBtn.classList.remove('activity-sparring__toggle-btn--active');
    });

    return wrapper;
  }

  // ============================================
  // Fill in the Blank (Text Input)
  // ============================================

  function renderFillBlankText(question, options) {
    const container = createElement('div', 'activity-question__content activity-fill');

    // Parse template and create inputs
    const template = question.template || question.prompt;
    const blanks = question.blanks || {};
    const blankIds = Object.keys(blanks);

    let html = template;
    blankIds.forEach(blankId => {
      const inputHtml = `<input type="text" class="activity-fill__input" data-blank-id="${blankId}" placeholder="..." autocomplete="off">`;
      html = html.replace(`{{${blankId}}}`, inputHtml);
    });

    const promptDiv = createElement('div', 'activity-fill__prompt');
    promptDiv.innerHTML = html;
    container.appendChild(promptDiv);

    // Check button
    const checkBtn = createElement('button', 'activity-fill__check', 'Check Answer');

    // Restore state
    if (options.response && options.response.answer) {
      Object.entries(options.response.answer).forEach(([blankId, value]) => {
        const input = promptDiv.querySelector(`[data-blank-id="${blankId}"]`);
        if (input) {
          input.value = value;
          if (options.response.correct) {
            input.classList.add('activity-fill__input--correct');
            input.disabled = true;
          }
        }
      });
      if (options.response.correct) {
        checkBtn.style.display = 'none';
      }
    }

    checkBtn.addEventListener('click', () => {
      handleFillBlankCheck(question, promptDiv, options, checkBtn);
    });

    container.appendChild(checkBtn);

    // Hint area
    const hintArea = createElement('div', 'activity-question__hint', '');
    hintArea.id = `hint-${question.id}`;
    hintArea.style.display = 'none';
    container.appendChild(hintArea);

    // Skip button
    const skipBtn = createElement('button', 'activity-question__skip', 'Skip this question');
    if (options.response?.correct || options.response?.skipped) {
      skipBtn.style.display = 'none';
    }
    skipBtn.addEventListener('click', () => {
      if (options.onSkip()) {
        skipBtn.style.display = 'none';
        updateQuestionStatus(question.id, { skipped: true });
      }
    });
    container.appendChild(skipBtn);

    return container;
  }

  function handleFillBlankCheck(question, promptDiv, options, checkBtn) {
    const blanks = question.blanks || {};
    const inputs = promptDiv.querySelectorAll('.activity-fill__input');
    const answers = {};
    let allCorrect = true;

    inputs.forEach(input => {
      const blankId = input.getAttribute('data-blank-id');
      const value = input.value.trim();
      answers[blankId] = value;

      const blank = blanks[blankId];
      const correctAnswer = blank.answer || blank.correct;
      const alternatives = blank.alternatives || [];

      const isCorrect = value.toLowerCase() === correctAnswer.toLowerCase() ||
        alternatives.some(alt => value.toLowerCase() === alt.toLowerCase());

      if (isCorrect) {
        input.classList.remove('activity-fill__input--incorrect');
        input.classList.add('activity-fill__input--correct');
      } else {
        input.classList.remove('activity-fill__input--correct');
        input.classList.add('activity-fill__input--incorrect');
        allCorrect = false;
      }
    });

    const currentAttempts = (options.response?.attempts || 0) + 1;

    if (allCorrect) {
      inputs.forEach(input => input.disabled = true);
      checkBtn.style.display = 'none';
      // Hide skip button
      const skipBtn = promptDiv.closest('.activity-question__content').querySelector('.activity-question__skip');
      if (skipBtn) skipBtn.style.display = 'none';
    } else {
      // Show hint after threshold
      if (question.hint && currentAttempts >= options.showHintsAfterAttempt) {
        const hintArea = document.getElementById(`hint-${question.id}`);
        if (hintArea) {
          hintArea.innerHTML = `<strong>Hint:</strong> ${question.hint}`;
          hintArea.style.display = 'block';
        }
      }

      // Show correct answers after max attempts
      if (currentAttempts >= options.maxRetries) {
        inputs.forEach(input => {
          const blankId = input.getAttribute('data-blank-id');
          const blank = blanks[blankId];
          input.value = blank.answer || blank.correct;
          input.classList.remove('activity-fill__input--incorrect');
          input.classList.add('activity-fill__input--correct');
          input.disabled = true;
        });
        checkBtn.style.display = 'none';
      }
    }

    options.response = {
      answer: answers,
      attempts: currentAttempts,
      correct: allCorrect,
      skipped: false
    };
    options.onAnswer(answers, allCorrect);
    updateQuestionStatus(question.id, options.response);
  }

  // ============================================
  // Fill in the Blank (Dropdown)
  // ============================================

  function renderFillBlankDropdown(question, options) {
    const container = createElement('div', 'activity-question__content activity-fill');

    const template = question.template || question.prompt;
    const blanks = question.blanks || {};
    const blankIds = Object.keys(blanks);

    let html = template;
    blankIds.forEach(blankId => {
      const blank = blanks[blankId];
      const optionsHtml = blank.options.map(opt =>
        `<option value="${opt}">${opt}</option>`
      ).join('');
      const selectHtml = `<select class="activity-fill__select" data-blank-id="${blankId}"><option value="">Select...</option>${optionsHtml}</select>`;
      html = html.replace(`{{${blankId}}}`, selectHtml);
    });

    const promptDiv = createElement('div', 'activity-fill__prompt');
    promptDiv.innerHTML = html;
    container.appendChild(promptDiv);

    // Check button
    const checkBtn = createElement('button', 'activity-fill__check', 'Check Answer');

    // Restore state
    if (options.response && options.response.answer) {
      Object.entries(options.response.answer).forEach(([blankId, value]) => {
        const select = promptDiv.querySelector(`[data-blank-id="${blankId}"]`);
        if (select) {
          select.value = value;
          if (options.response.correct) {
            select.classList.add('activity-fill__select--correct');
            select.disabled = true;
          }
        }
      });
      if (options.response.correct) {
        checkBtn.style.display = 'none';
      }
    }

    checkBtn.addEventListener('click', () => {
      handleFillDropdownCheck(question, promptDiv, options, checkBtn);
    });

    container.appendChild(checkBtn);

    // Hint area
    const hintArea = createElement('div', 'activity-question__hint', '');
    hintArea.id = `hint-${question.id}`;
    hintArea.style.display = 'none';
    container.appendChild(hintArea);

    // Skip button
    const skipBtn = createElement('button', 'activity-question__skip', 'Skip this question');
    if (options.response?.correct || options.response?.skipped) {
      skipBtn.style.display = 'none';
    }
    skipBtn.addEventListener('click', () => {
      if (options.onSkip()) {
        skipBtn.style.display = 'none';
        updateQuestionStatus(question.id, { skipped: true });
      }
    });
    container.appendChild(skipBtn);

    return container;
  }

  function handleFillDropdownCheck(question, promptDiv, options, checkBtn) {
    const blanks = question.blanks || {};
    const selects = promptDiv.querySelectorAll('.activity-fill__select');
    const answers = {};
    let allCorrect = true;

    selects.forEach(select => {
      const blankId = select.getAttribute('data-blank-id');
      const value = select.value;
      answers[blankId] = value;

      const blank = blanks[blankId];
      const isCorrect = value === blank.correct;

      if (isCorrect) {
        select.classList.remove('activity-fill__select--incorrect');
        select.classList.add('activity-fill__select--correct');
      } else {
        select.classList.remove('activity-fill__select--correct');
        select.classList.add('activity-fill__select--incorrect');
        allCorrect = false;
      }
    });

    const currentAttempts = (options.response?.attempts || 0) + 1;

    if (allCorrect) {
      selects.forEach(select => select.disabled = true);
      checkBtn.style.display = 'none';
      const skipBtn = promptDiv.closest('.activity-question__content').querySelector('.activity-question__skip');
      if (skipBtn) skipBtn.style.display = 'none';
    } else {
      if (question.hint && currentAttempts >= options.showHintsAfterAttempt) {
        const hintArea = document.getElementById(`hint-${question.id}`);
        if (hintArea) {
          hintArea.innerHTML = `<strong>Hint:</strong> ${question.hint}`;
          hintArea.style.display = 'block';
        }
      }

      if (currentAttempts >= options.maxRetries) {
        selects.forEach(select => {
          const blankId = select.getAttribute('data-blank-id');
          const blank = blanks[blankId];
          select.value = blank.correct;
          select.classList.remove('activity-fill__select--incorrect');
          select.classList.add('activity-fill__select--correct');
          select.disabled = true;
        });
        checkBtn.style.display = 'none';
      }
    }

    options.response = {
      answer: answers,
      attempts: currentAttempts,
      correct: allCorrect,
      skipped: false
    };
    options.onAnswer(answers, allCorrect);
    updateQuestionStatus(question.id, options.response);
  }

  // ============================================
  // Match Following (Tap to Select)
  // ============================================

  function renderMatchFollowing(question, options) {
    const container = createElement('div', 'activity-question__content activity-match');

    const prompt = createElement('p', 'activity-question__prompt', question.prompt);
    container.appendChild(prompt);

    const pairs = question.pairs || [];
    const leftItems = pairs.map((p, i) => ({ text: p.left, index: i }));
    const rightItems = pairs.map((p, i) => ({ text: p.right, index: i }));

    // Shuffle right items if specified
    const shuffledRight = question.shuffleRight !== false ? shuffleArray(rightItems) : rightItems;

    // Track matches
    const matches = options.response?.answer ? { ...options.response.answer } : {};
    let selectedLeft = null;

    const matchContainer = createElement('div', 'activity-match__container');

    // Left column
    const leftCol = createElement('div', 'activity-match__column activity-match__column--left');
    leftItems.forEach(item => {
      const btn = createElement('button', 'activity-match__item activity-match__item--left');
      btn.setAttribute('data-index', item.index);
      btn.textContent = item.text;

      // Mark if already matched
      if (matches[item.index] !== undefined) {
        btn.classList.add('activity-match__item--matched');
      }

      btn.addEventListener('click', () => {
        if (options.response?.correct) return;

        // Deselect others
        leftCol.querySelectorAll('.activity-match__item').forEach(b => b.classList.remove('activity-match__item--selected'));

        // Select this one
        btn.classList.add('activity-match__item--selected');
        selectedLeft = item.index;
      });

      leftCol.appendChild(btn);
    });

    // Right column
    const rightCol = createElement('div', 'activity-match__column activity-match__column--right');
    shuffledRight.forEach(item => {
      const btn = createElement('button', 'activity-match__item activity-match__item--right');
      btn.setAttribute('data-index', item.index);
      btn.textContent = item.text;

      // Mark if already matched
      const matchedTo = Object.entries(matches).find(([k, v]) => v === item.index);
      if (matchedTo) {
        btn.classList.add('activity-match__item--matched');
      }

      btn.addEventListener('click', () => {
        if (options.response?.correct) return;
        if (selectedLeft === null) {
          alert('First select an item from the left column.');
          return;
        }

        // Create match
        matches[selectedLeft] = item.index;

        // Update UI
        const leftBtn = leftCol.querySelector(`[data-index="${selectedLeft}"]`);
        leftBtn.classList.remove('activity-match__item--selected');
        leftBtn.classList.add('activity-match__item--matched');
        btn.classList.add('activity-match__item--matched');

        selectedLeft = null;

        // Update stored response
        options.response = {
          answer: { ...matches },
          attempts: options.response?.attempts || 0,
          correct: null,
          skipped: false
        };
      });

      rightCol.appendChild(btn);
    });

    matchContainer.appendChild(leftCol);
    matchContainer.appendChild(rightCol);
    container.appendChild(matchContainer);

    // Check button
    const checkBtn = createElement('button', 'activity-match__check', 'Check Matches');

    if (options.response?.correct) {
      checkBtn.style.display = 'none';
    }

    checkBtn.addEventListener('click', () => {
      handleMatchCheck(question, matches, leftCol, rightCol, options, checkBtn);
    });

    container.appendChild(checkBtn);

    // Clear button
    const clearBtn = createElement('button', 'activity-match__clear', 'Clear Matches');
    if (options.response?.correct) {
      clearBtn.style.display = 'none';
    }
    clearBtn.addEventListener('click', () => {
      Object.keys(matches).forEach(k => delete matches[k]);
      leftCol.querySelectorAll('.activity-match__item').forEach(b => {
        b.classList.remove('activity-match__item--matched', 'activity-match__item--correct', 'activity-match__item--incorrect');
      });
      rightCol.querySelectorAll('.activity-match__item').forEach(b => {
        b.classList.remove('activity-match__item--matched', 'activity-match__item--correct', 'activity-match__item--incorrect');
      });
    });
    container.appendChild(clearBtn);

    // Hint area
    const hintArea = createElement('div', 'activity-question__hint', '');
    hintArea.id = `hint-${question.id}`;
    hintArea.style.display = 'none';
    container.appendChild(hintArea);

    // Skip button
    const skipBtn = createElement('button', 'activity-question__skip', 'Skip this question');
    if (options.response?.correct || options.response?.skipped) {
      skipBtn.style.display = 'none';
    }
    skipBtn.addEventListener('click', () => {
      if (options.onSkip()) {
        skipBtn.style.display = 'none';
        updateQuestionStatus(question.id, { skipped: true });
      }
    });
    container.appendChild(skipBtn);

    return container;
  }

  function handleMatchCheck(question, matches, leftCol, rightCol, options, checkBtn) {
    const pairs = question.pairs || [];

    // Check if all items are matched
    if (Object.keys(matches).length !== pairs.length) {
      alert('Please match all items before checking.');
      return;
    }

    let allCorrect = true;

    // Check each match - correct match is when left index matches right index
    Object.entries(matches).forEach(([leftIndex, rightIndex]) => {
      const leftBtn = leftCol.querySelector(`[data-index="${leftIndex}"]`);
      const rightBtn = rightCol.querySelector(`[data-index="${rightIndex}"]`);

      // Correct if leftIndex === rightIndex (they were originally paired)
      const isCorrect = parseInt(leftIndex) === parseInt(rightIndex);

      if (isCorrect) {
        leftBtn.classList.add('activity-match__item--correct');
        rightBtn.classList.add('activity-match__item--correct');
      } else {
        leftBtn.classList.add('activity-match__item--incorrect');
        rightBtn.classList.add('activity-match__item--incorrect');
        allCorrect = false;
      }
    });

    const currentAttempts = (options.response?.attempts || 0) + 1;

    if (allCorrect) {
      checkBtn.style.display = 'none';
      const clearBtn = checkBtn.nextElementSibling;
      if (clearBtn) clearBtn.style.display = 'none';
      const skipBtn = checkBtn.closest('.activity-question__content').querySelector('.activity-question__skip');
      if (skipBtn) skipBtn.style.display = 'none';
    } else {
      // Show hint after threshold
      if (question.hint && currentAttempts >= options.showHintsAfterAttempt) {
        const hintArea = document.getElementById(`hint-${question.id}`);
        if (hintArea) {
          hintArea.innerHTML = `<strong>Hint:</strong> ${question.hint}`;
          hintArea.style.display = 'block';
        }
      }

      // Show correct answers after max attempts
      if (currentAttempts >= options.maxRetries) {
        // Clear incorrect highlights and show correct matches
        leftCol.querySelectorAll('.activity-match__item').forEach((btn, i) => {
          btn.classList.remove('activity-match__item--incorrect');
          btn.classList.add('activity-match__item--correct');
        });
        rightCol.querySelectorAll('.activity-match__item').forEach(btn => {
          btn.classList.remove('activity-match__item--incorrect');
          btn.classList.add('activity-match__item--correct');
        });
        checkBtn.style.display = 'none';
        const clearBtn = checkBtn.nextElementSibling;
        if (clearBtn) clearBtn.style.display = 'none';
      }
    }

    options.response = {
      answer: { ...matches },
      attempts: currentAttempts,
      correct: allCorrect,
      skipped: false
    };
    options.onAnswer(matches, allCorrect);
    updateQuestionStatus(question.id, options.response);
  }

  // ============================================
  // AI Discussion — prompt building & response parsing
  // ============================================

  function buildDiscussionSystemPrompt(course, questionCount) {
    return `You are a peer discussion facilitator for a university course${course ? ` (${course})` : ''}. Your role is to help students have deeper conversations about their reflections and work.

Given a student's written response to a prompt, generate exactly ${questionCount} follow-up discussion questions. These questions will be used by a PARTNER who will ask them to the AUTHOR of the response in a face-to-face conversation.

Guidelines for generating questions:
- First, check if the response actually addresses the original prompt. If it doesn't, your observation should note this and at least one question should gently redirect — e.g., "The prompt asked about X, but your response focused on Y. Can you walk me through how those connect?"
- Questions should probe deeper into the student's thinking, not quiz them
- Ask "why" and "how" questions that encourage elaboration
- Challenge assumptions gently — "What if..." or "Have you considered..."
- Connect to concrete experiences — "Can you give me an example of..."
- Avoid yes/no questions
- Each question should explore a different angle of the response
- Keep questions conversational and natural, not academic or stiff
- Questions should be ones a thoughtful peer would ask, not a professor

Also provide a brief observation (1-2 sentences) about a strength or interesting aspect of the response that the partner can use to open the conversation positively.

Respond in this exact JSON format:
{
  "questions": ["Question 1?", "Question 2?", "Question 3?"],
  "observation": "Brief positive observation about the response."
}`;
  }

  function buildDiscussionUserMessage(prompt, responseText, context, questionCount) {
    return `Original prompt the student was responding to:
"${prompt}"

${context ? `Activity context: ${context}\n\n` : ''}Student's written response:
"${responseText}"

Generate ${questionCount} discussion questions for the partner to ask.`;
  }

  function parseDiscussionJson(rawText) {
    // Claude sometimes wraps JSON in markdown code blocks
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch { /* fall through */ }
    // Fallback: use the raw text as a single question
    return {
      questions: [rawText.trim()],
      observation: 'Here are some thoughts on this response.',
    };
  }

  // ============================================
  // AI Discussion (Enter → AI Questions → Discuss → Summarize)
  // ============================================

  function renderAiDiscussion(question, options) {
    const container = createElement('div', 'activity-question__content activity-ai-discussion');
    const themeClass = options.courseTheme === 'cst349' ? 'indigo' : 'teal';

    // Phase tracking via response state
    // options.response is { answer: {..., phase}, attempts, correct, skipped }
    const savedData = options.response?.answer || {};
    const currentPhase = savedData.phase || 'enter';

    // --- Prompt ---
    const prompt = createElement('p', 'activity-question__prompt', question.prompt);
    container.appendChild(prompt);

    if (question.partnerInstructions) {
      const instructions = createElement('div', 'activity-ai-discussion__instructions');
      instructions.innerHTML = `<strong>Instructions:</strong> ${question.partnerInstructions}`;
      container.appendChild(instructions);
    }

    // --- Phase 1: Enter the paper response ---
    const enterPhase = createElement('div', 'activity-ai-discussion__phase activity-ai-discussion__phase--enter');
    enterPhase.id = `ai-enter-${question.id}`;

    // Optional: question selector dropdown (for "choose 1 of N" prompts)
    let selectedPromptText = question.prompt;
    if (question.questionOptions && question.questionOptions.length > 0) {
      const selectorWrapper = createElement('div', 'activity-ai-discussion__selector');
      const selectorLabel = createElement('label', 'activity-ai-discussion__selector-label',
        question.selectorLabel || 'Which question is your partner responding to?');
      selectorLabel.setAttribute('for', `ai-selector-${question.id}`);
      selectorWrapper.appendChild(selectorLabel);

      const selector = document.createElement('select');
      selector.className = 'activity-ai-discussion__selector-dropdown';
      selector.id = `ai-selector-${question.id}`;

      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = 'Select a question...';
      selector.appendChild(defaultOpt);

      question.questionOptions.forEach((opt, i) => {
        const optEl = document.createElement('option');
        optEl.value = i;
        optEl.textContent = opt;
        selector.appendChild(optEl);
      });

      // Restore saved selection
      if (savedData.selectedOption !== undefined && savedData.selectedOption !== null) {
        selector.value = savedData.selectedOption;
        selectedPromptText = question.questionOptions[savedData.selectedOption] || question.prompt;
      }

      selector.addEventListener('change', () => {
        const idx = selector.value;
        if (idx !== '') {
          selectedPromptText = question.questionOptions[parseInt(idx)];
        }
      });

      selectorWrapper.appendChild(selector);
      enterPhase.appendChild(selectorWrapper);
    }

    const textarea = document.createElement('textarea');
    textarea.className = 'activity-open__textarea';
    textarea.placeholder = question.placeholder || 'Type your partner\'s written response here...';
    textarea.rows = 6;

    if (savedData.enteredResponse) {
      textarea.value = savedData.enteredResponse;
    }

    enterPhase.appendChild(textarea);

    // Character count
    const minLength = question.minLength || 50;
    const charCount = createElement('div', 'activity-open__charcount');
    charCount.innerHTML = `<span id="ai-charcount-${question.id}">${textarea.value.length}</span> characters (minimum ${minLength})`;
    enterPhase.appendChild(charCount);

    textarea.addEventListener('input', () => {
      const count = textarea.value.length;
      document.getElementById(`ai-charcount-${question.id}`).textContent = count;
      if (count < minLength) {
        charCount.classList.add('activity-open__charcount--insufficient');
      } else {
        charCount.classList.remove('activity-open__charcount--insufficient');
      }
    });

    // Generate questions button
    const generateBtn = createElement('button', 'activity-ai-discussion__generate-btn');
    generateBtn.innerHTML = (question.generateButtonText || 'Get Discussion Questions') + ' &rarr;';
    generateBtn.addEventListener('click', () => {
      // Validate dropdown selection if question options exist
      if (question.questionOptions && question.questionOptions.length > 0) {
        const selector = document.getElementById(`ai-selector-${question.id}`);
        if (selector && selector.value === '') {
          alert('Please select which question your partner is responding to.');
          return;
        }
      }
      const text = textarea.value.trim();
      if (text.length < minLength) {
        alert(`Please enter at least ${minLength} characters before generating discussion questions.`);
        return;
      }
      // Pass the selected prompt (from dropdown or the default prompt)
      const effectivePrompt = selectedPromptText;
      handleAiGenerate(question, text, options, container, effectivePrompt, savedData);
    });
    enterPhase.appendChild(generateBtn);

    container.appendChild(enterPhase);

    // --- Phase 2: AI-generated discussion questions ---
    const discussPhase = createElement('div', 'activity-ai-discussion__phase activity-ai-discussion__phase--discuss');
    discussPhase.id = `ai-discuss-${question.id}`;
    discussPhase.style.display = (currentPhase === 'discuss' || currentPhase === 'summarize') ? 'block' : 'none';

    // Observation bubble
    const observationEl = createElement('div', 'activity-ai-discussion__observation');
    observationEl.id = `ai-observation-${question.id}`;
    if (savedData.observation) {
      observationEl.innerHTML = `<strong>Opening thought:</strong> ${savedData.observation}`;
    }
    discussPhase.appendChild(observationEl);

    // Questions list
    const questionsList = createElement('div', 'activity-ai-discussion__questions-list');
    questionsList.id = `ai-questions-list-${question.id}`;
    if (savedData.aiQuestions) {
      savedData.aiQuestions.forEach((q, i) => {
        const qEl = createElement('div', 'activity-ai-discussion__question-item');
        qEl.innerHTML = `<span class="activity-ai-discussion__question-number">${i + 1}</span><span>${q}</span>`;
        questionsList.appendChild(qEl);
      });
    }
    discussPhase.appendChild(questionsList);

    const discussPrompt = createElement('p', 'activity-ai-discussion__discuss-prompt',
      question.discussionPrompt || 'Take a few minutes to discuss these questions face-to-face with the author. When you\'re done, summarize below.');
    discussPhase.appendChild(discussPrompt);

    container.appendChild(discussPhase);

    // --- Loading state ---
    const loadingEl = createElement('div', 'activity-ai-discussion__loading');
    loadingEl.id = `ai-loading-${question.id}`;
    loadingEl.style.display = 'none';
    loadingEl.innerHTML = `
      <div class="activity-ai-discussion__spinner"></div>
      <p>${question.loadingText || 'Generating discussion questions...'}</p>
    `;
    container.appendChild(loadingEl);

    // --- Error state ---
    const errorEl = createElement('div', 'activity-ai-discussion__error');
    errorEl.id = `ai-error-${question.id}`;
    errorEl.style.display = 'none';
    container.appendChild(errorEl);

    // --- Phase 3: Discussion summary ---
    const summaryPhase = createElement('div', 'activity-ai-discussion__phase activity-ai-discussion__phase--summarize');
    summaryPhase.id = `ai-summarize-${question.id}`;
    summaryPhase.style.display = (currentPhase === 'discuss' || currentPhase === 'summarize') ? 'block' : 'none';

    const summaryLabel = createElement('label', 'activity-ai-discussion__summary-label', question.summaryLabel || 'Discussion Summary');
    summaryPhase.appendChild(summaryLabel);

    const summaryTextarea = document.createElement('textarea');
    summaryTextarea.className = 'activity-open__textarea activity-ai-discussion__summary-textarea';
    summaryTextarea.placeholder = question.summaryPlaceholder || 'What were the key insights from your discussion? What surprised you? What did the author learn from the questions?';
    summaryTextarea.rows = 5;
    summaryTextarea.id = `ai-summary-textarea-${question.id}`;

    if (savedData.discussionSummary) {
      summaryTextarea.value = savedData.discussionSummary;
    }
    summaryPhase.appendChild(summaryTextarea);

    const saveBtnText = question.saveButtonText || 'Save Discussion Summary';
    const updateBtnText = question.updateButtonText || 'Update Summary';
    const saveBtn = createElement('button', 'activity-open__save', savedData.discussionSummary ? updateBtnText : saveBtnText);

    // --- Dig Deeper button (shown after first save) ---
    const digDeeperBtn = createElement('button', 'activity-ai-discussion__dig-deeper-btn');
    digDeeperBtn.innerHTML = (question.digDeeperText || 'Dig deeper with AI guidance') + ' &rarr;';
    digDeeperBtn.style.display = 'none';

    // Iteration counter display
    const iterationInfo = createElement('div', 'activity-ai-discussion__iteration-info');
    iterationInfo.id = `ai-iteration-info-${question.id}`;
    const currentIterations = savedData.iterations || 0;
    if (currentIterations > 1) {
      iterationInfo.textContent = `${currentIterations} rounds of AI guidance completed`;
      iterationInfo.style.display = 'block';
    } else {
      iterationInfo.style.display = 'none';
    }

    // Show dig deeper button if already saved
    if (currentPhase === 'summarize' && savedData.discussionSummary) {
      digDeeperBtn.style.display = 'inline-block';
    }

    saveBtn.addEventListener('click', () => {
      const summary = summaryTextarea.value.trim();
      if (summary.length < 30) {
        alert('Please write at least a brief summary of your discussion (minimum 30 characters).');
        return;
      }

      const fullAnswer = {
        enteredResponse: savedData.enteredResponse || options.response?.answer?.enteredResponse || textarea.value.trim(),
        selectedOption: savedData.selectedOption ?? null,
        selectedPrompt: savedData.selectedPrompt || question.prompt,
        aiQuestions: savedData.aiQuestions || [],
        observation: savedData.observation || '',
        discussionSummary: summary,
        iterations: savedData.iterations || 1,
        phase: 'summarize',
      };

      savedData.discussionSummary = summary;
      savedData.phase = 'summarize';
      if (!savedData.iterations) savedData.iterations = 1;

      options.response = {
        answer: fullAnswer,
        attempts: 1,
        correct: null,
        skipped: false,
      };
      options.onAnswer(fullAnswer, null);
      updateQuestionStatus(question.id, { answer: fullAnswer, attempts: 1, correct: null, skipped: false });

      saveBtn.textContent = 'Saved \u2713';
      setTimeout(() => { saveBtn.textContent = updateBtnText; }, 2000);

      // Show dig deeper button after saving
      digDeeperBtn.style.display = 'inline-block';
    });
    summaryPhase.appendChild(saveBtn);

    digDeeperBtn.addEventListener('click', () => {
      const summaryText = summaryTextarea.value.trim();
      if (summaryText.length < 30) {
        alert('Please write or update your response before digging deeper (minimum 30 characters).');
        return;
      }
      handleAiIterate(question, summaryText, options, container, savedData, digDeeperBtn, iterationInfo);
    });
    summaryPhase.appendChild(digDeeperBtn);
    summaryPhase.appendChild(iterationInfo);

    container.appendChild(summaryPhase);

    // --- If already in discuss/summarize phase, keep textarea and button editable so student can update and regenerate ---
    if (currentPhase === 'discuss' || currentPhase === 'summarize') {
      generateBtn.innerHTML = (question.generateButtonText || 'Get Discussion Questions') + ' (update) &rarr;';
    }

    return container;
  }

  async function handleAiGenerate(question, responseText, options, container, effectivePrompt, savedData) {
    const loadingEl = document.getElementById(`ai-loading-${question.id}`);
    const errorEl = document.getElementById(`ai-error-${question.id}`);
    const enterPhase = document.getElementById(`ai-enter-${question.id}`);
    const discussPhase = document.getElementById(`ai-discuss-${question.id}`);
    const summaryPhase = document.getElementById(`ai-summarize-${question.id}`);

    // Show loading, hide error
    loadingEl.style.display = 'flex';
    errorEl.style.display = 'none';

    // Disable the generate button
    const generateBtn = enterPhase.querySelector('.activity-ai-discussion__generate-btn');
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.textContent = 'Generating...';
    }

    // Get the AI endpoint from the activity config
    const aiEndpoint = question.aiEndpoint ||
      options.aiEndpoint ||
      '/.netlify/functions/ai-proxy';

    const course = options.courseTheme === 'cst349' ? 'CST349' : 'CST395';
    const questionCount = question.numQuestions || 3;
    const prompt = effectivePrompt || question.prompt;

    try {
      const fetchResponse = await fetch(aiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildDiscussionSystemPrompt(course, questionCount),
          messages: [{ role: 'user', content: buildDiscussionUserMessage(prompt, responseText, question.aiContext || '', questionCount) }],
          max_tokens: 512,
        }),
      });

      if (!fetchResponse.ok) {
        const errData = await fetchResponse.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${fetchResponse.status})`);
      }

      const raw = await fetchResponse.json();
      const data = parseDiscussionJson(raw.content);

      // Hide loading
      loadingEl.style.display = 'none';

      // Populate the discussion phase
      const observationEl = document.getElementById(`ai-observation-${question.id}`);
      if (observationEl && data.observation) {
        observationEl.innerHTML = `<strong>Opening thought:</strong> ${escapeHtml(data.observation)}`;
      }

      const questionsList = document.getElementById(`ai-questions-list-${question.id}`);
      questionsList.innerHTML = '';
      data.questions.forEach((q, i) => {
        const qEl = createElement('div', 'activity-ai-discussion__question-item');
        qEl.innerHTML = `<span class="activity-ai-discussion__question-number">${i + 1}</span><span>${escapeHtml(q)}</span>`;
        questionsList.appendChild(qEl);
      });

      // Show discuss and summary phases
      discussPhase.style.display = 'block';
      summaryPhase.style.display = 'block';

      // Re-enable the entry textarea and button so student can edit and regenerate
      const textarea = enterPhase.querySelector('textarea');
      if (textarea) textarea.disabled = false;
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = (question.generateButtonText || 'Get Discussion Questions') + ' (update) &rarr;';
      }

      // Save intermediate state to localStorage so it survives page refresh
      const selectorEl = document.getElementById(`ai-selector-${question.id}`);
      const existingSummary = options.response?.answer?.discussionSummary || '';
      const existingIterations = options.response?.answer?.iterations || 0;
      const intermediateAnswer = {
        enteredResponse: responseText,
        selectedOption: selectorEl ? parseInt(selectorEl.value) : null,
        selectedPrompt: effectivePrompt || question.prompt,
        aiQuestions: data.questions,
        observation: data.observation || '',
        discussionSummary: existingSummary,
        iterations: existingIterations + 1,
        phase: 'discuss',
      };
      options.response = {
        answer: intermediateAnswer,
        attempts: 0,
        correct: null,
        skipped: false,
      };
      // Persist via onAnswer so state survives refresh
      options.onAnswer(intermediateAnswer, null);

      // Sync intermediateAnswer fields back to savedData so downstream
      // handlers (save button, dig deeper) see the correct values
      Object.assign(savedData, intermediateAnswer);

    } catch (error) {
      console.error('AI discussion error:', error);
      loadingEl.style.display = 'none';
      errorEl.style.display = 'block';
      errorEl.innerHTML = `
        <p><strong>Could not generate questions.</strong> ${escapeHtml(error.message)}</p>
        <button class="activity-ai-discussion__retry-btn" onclick="this.parentElement.style.display='none'">Dismiss</button>
      `;

      // Re-enable the generate button
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = 'Try Again &rarr;';
      }
    }
  }

  async function handleAiIterate(question, summaryText, options, container, savedData, digDeeperBtn, iterationInfo) {
    const loadingEl = document.getElementById(`ai-loading-${question.id}`);
    const errorEl = document.getElementById(`ai-error-${question.id}`);
    const currentIterations = savedData.iterations || 1;

    loadingEl.style.display = 'flex';
    errorEl.style.display = 'none';
    digDeeperBtn.disabled = true;
    digDeeperBtn.textContent = 'Generating...';

    const aiEndpoint = question.aiEndpoint ||
      options.aiEndpoint ||
      '/.netlify/functions/ai-proxy';

    const course = options.courseTheme === 'cst349' ? 'CST349' : 'CST395';
    const questionCount = question.numQuestions || 3;
    const iterContext = (question.aiContext || '') +
      '\n\nThis is iteration ' + (currentIterations + 1) + '. The student is refining their thinking. Push them to be more specific and go deeper.';

    try {
      const fetchResponse = await fetch(aiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildDiscussionSystemPrompt(course, questionCount),
          messages: [{ role: 'user', content: buildDiscussionUserMessage(savedData.selectedPrompt || question.prompt, summaryText, iterContext, questionCount) }],
          max_tokens: 512,
        }),
      });

      if (!fetchResponse.ok) {
        const errData = await fetchResponse.json().catch(() => ({}));
        throw new Error(errData.error || 'Request failed (' + fetchResponse.status + ')');
      }

      const raw = await fetchResponse.json();
      const data = parseDiscussionJson(raw.content);
      loadingEl.style.display = 'none';

      // Replace observation and questions
      const observationEl = document.getElementById(`ai-observation-${question.id}`);
      if (observationEl && data.observation) {
        observationEl.innerHTML = '<strong>Opening thought:</strong> ' + escapeHtml(data.observation);
      }

      const questionsList = document.getElementById(`ai-questions-list-${question.id}`);
      questionsList.innerHTML = '';
      data.questions.forEach(function(q, i) {
        const qEl = createElement('div', 'activity-ai-discussion__question-item');
        qEl.innerHTML = '<span class="activity-ai-discussion__question-number">' + (i + 1) + '</span><span>' + escapeHtml(q) + '</span>';
        questionsList.appendChild(qEl);
      });

      // Update savedData
      savedData.aiQuestions = data.questions;
      savedData.observation = data.observation || '';
      savedData.iterations = currentIterations + 1;

      // Save state — use preserved enteredResponse from savedData or options.response
      const preservedResponse = savedData.enteredResponse || options.response?.answer?.enteredResponse || '';
      const fullAnswer = {
        enteredResponse: preservedResponse,
        selectedOption: savedData.selectedOption ?? null,
        selectedPrompt: savedData.selectedPrompt || question.prompt,
        aiQuestions: data.questions,
        observation: data.observation || '',
        discussionSummary: summaryText,
        iterations: currentIterations + 1,
        phase: 'summarize',
      };
      options.response = { answer: fullAnswer, attempts: 1, correct: null, skipped: false };
      options.onAnswer(fullAnswer, null);
      updateQuestionStatus(question.id, { answer: fullAnswer, attempts: 1, correct: null, skipped: false });

      // Sync fullAnswer back to savedData so subsequent iterations stay consistent
      Object.assign(savedData, fullAnswer);

      // Update iteration counter display
      iterationInfo.textContent = (currentIterations + 1) + ' rounds of AI guidance completed';
      iterationInfo.style.display = 'block';

      digDeeperBtn.disabled = false;
      digDeeperBtn.innerHTML = (question.digDeeperText || 'Dig deeper with AI guidance') + ' &rarr;';

    } catch (error) {
      console.error('AI iteration error:', error);
      loadingEl.style.display = 'none';
      errorEl.style.display = 'block';
      errorEl.innerHTML =
        '<p><strong>Could not generate questions.</strong> ' + escapeHtml(error.message) + '</p>' +
        '<button class="activity-ai-discussion__retry-btn" onclick="this.parentElement.style.display=\'none\'">Dismiss</button>';
      digDeeperBtn.disabled = false;
      digDeeperBtn.innerHTML = (question.digDeeperText || 'Dig deeper with AI guidance') + ' &rarr;';
    }
  }

  // ============================================
  // Partner Entry Question Type
  // ============================================

  function renderPartnerEntry(question, options) {
    const container = createElement('div', 'activity-partner-entry');
    const savedData = options.response?.answer || {};

    // Partner instructions
    if (question.partnerInstructions) {
      const instructions = createElement('div', 'activity-partner-entry__instructions');
      instructions.innerHTML = question.partnerInstructions;
      container.appendChild(instructions);
    }

    // Prompt
    const promptEl = createElement('div', 'activity-question__prompt');
    promptEl.innerHTML = question.prompt;
    container.appendChild(promptEl);

    // Optional selector dropdown
    let selectorEl = null;
    if (question.questionOptions && question.questionOptions.length > 0) {
      const selectorWrap = createElement('div', 'activity-partner-entry__selector');
      const label = createElement('label', 'activity-partner-entry__selector-label');
      label.textContent = question.selectorLabel || 'Which question did your partner respond to?';
      selectorWrap.appendChild(label);

      selectorEl = document.createElement('select');
      selectorEl.className = 'activity-ai-discussion__selector-dropdown';
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = '— Select —';
      selectorEl.appendChild(defaultOpt);
      question.questionOptions.forEach((opt, i) => {
        const o = document.createElement('option');
        o.value = i;
        o.textContent = opt;
        if (savedData.selectedOption === i) o.selected = true;
        selectorEl.appendChild(o);
      });
      selectorWrap.appendChild(selectorEl);
      container.appendChild(selectorWrap);
    }

    // Textarea
    const textarea = document.createElement('textarea');
    textarea.className = 'activity-open-ended__textarea';
    textarea.placeholder = question.placeholder || 'Enter response here...';
    textarea.value = savedData.text || '';
    textarea.rows = 6;
    container.appendChild(textarea);

    // Character count
    const minLength = question.minLength || 0;
    const charCount = createElement('div', 'activity-open-ended__char-count');
    const updateCount = () => {
      const len = textarea.value.trim().length;
      charCount.textContent = minLength > 0
        ? `${len} / ${minLength} min characters`
        : `${len} characters`;
      charCount.style.color = (minLength > 0 && len < minLength) ? '#ef4444' : '#6b7280';
    };
    updateCount();
    textarea.addEventListener('input', updateCount);
    container.appendChild(charCount);

    // Save button
    const saveBtn = createElement('button', 'activity-open-ended__save-btn', 'Save Response');
    if (savedData.text) {
      saveBtn.textContent = 'Update Response';
    }

    // Build the answer payload from current field state.
    function currentAnswer() {
      const text = textarea.value.trim();
      const selectedIdx = selectorEl ? parseInt(selectorEl.value) : null;
      return {
        text: text,
        selectedOption: isNaN(selectedIdx) ? null : selectedIdx,
        selectedPrompt: (selectedIdx !== null && !isNaN(selectedIdx) && question.questionOptions)
          ? question.questionOptions[selectedIdx]
          : question.prompt
      };
    }

    // ---- Autosave on blur + debounced typing. Doesn't enforce minLength
    // (that's only required for the explicit Save click) and doesn't bump
    // the attempts counter on the engine side.
    let pesAutosaveTimer = null;
    function pesAutosave() {
      if (pesAutosaveTimer) clearTimeout(pesAutosaveTimer);
      pesAutosaveTimer = setTimeout(function() {
        if (typeof options.onAnswer === 'function') {
          options.onAnswer(currentAnswer(), null, true);
        }
      }, 600);
    }
    textarea.addEventListener('input', pesAutosave);
    textarea.addEventListener('blur', pesAutosave);
    if (selectorEl) {
      selectorEl.addEventListener('change', pesAutosave);
    }

    saveBtn.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (minLength > 0 && text.length < minLength) {
        alert(`Please write at least ${minLength} characters.`);
        return;
      }
      const answer = currentAnswer();
      options.onAnswer(answer, null);
      updateQuestionStatus(question.id, { answer, attempts: 1, correct: null, skipped: false });
      saveBtn.textContent = 'Update Response';
    });
    container.appendChild(saveBtn);

    return container;
  }

  // ============================================
  // QFT Discussion Question Type
  // ============================================

  function renderQftDiscussion(question, options) {
    const container = createElement('div', 'activity-qft');
    const savedData = options.response?.answer || {};
    const qftMin = question.qftMin || 3;
    const qftMax = question.qftMax || 4;

    // Source responses (read-only display of partner's earlier answers)
    const sourceIds = question.sourceQuestions || [];

    const sourcesBox = createElement('div', 'activity-qft__sources');

    function refreshSourcesPanel() {
      const currentResponses = options.getAllResponses ? options.getAllResponses() : {};
      sourcesBox.innerHTML = '<div class="activity-qft__sources-label">Your partner\'s responses (from earlier questions):</div>';
      let found = false;
      sourceIds.forEach(srcId => {
        const resp = currentResponses[srcId];
        if (resp && resp.answer) {
          found = true;
          const text = typeof resp.answer === 'string' ? resp.answer : (resp.answer.text || resp.answer.enteredResponse || JSON.stringify(resp.answer));
          const srcEl = createElement('div', 'activity-qft__source-item');
          const srcConfig = options.questionConfig?.[srcId];
          const label = srcConfig ? (srcConfig.prompt || srcId).substring(0, 80) + (srcConfig.prompt?.length > 80 ? '...' : '') : srcId;
          srcEl.innerHTML = '<div class="activity-qft__source-label">' + escapeHtml(label) + '</div>' +
            '<div class="activity-qft__source-text">' + escapeHtml(text) + '</div>';
          sourcesBox.appendChild(srcEl);
        }
      });
      if (!found) {
        sourcesBox.innerHTML += '<p style="color:#9ca3af;font-size:13px;font-style:italic;">Complete the earlier questions first to see your partner\'s responses here.</p>';
      }
    }

    refreshSourcesPanel();

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) refreshSourcesPanel();
      }, { threshold: 0.1 });
      observer.observe(sourcesBox);
    }

    container.appendChild(sourcesBox);

    // Prompt
    if (question.prompt) {
      const promptEl = createElement('div', 'activity-question__prompt');
      promptEl.innerHTML = question.prompt || `Write ${qftMin}-${qftMax} follow-up questions for your partner based on their responses above.`;
      container.appendChild(promptEl);
    }

    // QFT rules (simplified)
    const rules = createElement('div', 'activity-qft__rules');
    rules.innerHTML =
      '<div class="activity-qft__rules-title">Question Formulation Technique (QFT) — Quick Rules</div>' +
      '<ul>' +
        '<li><strong>Ask questions, don\'t make statements</strong> — if it\'s really an opinion, rephrase it as a question</li>' +
        '<li><strong>Tag each question as Open or Closed</strong> — Open questions need explanation; Closed questions have short/yes-no answers</li>' +
        (question.requireMix ? '<li><strong>Include at least one of each type</strong> — a mix reveals more than all-open or all-closed</li>' : '') +
      '</ul>';
    container.appendChild(rules);

    // Question input rows
    const questionsWrap = createElement('div', 'activity-qft__questions-wrap');
    const savedQuestions = savedData.questions || [];

    for (let i = 0; i < qftMax; i++) {
      const row = createElement('div', 'activity-qft__question-input');
      const numLabel = createElement('span', 'activity-qft__question-num', `${i + 1}.`);
      row.appendChild(numLabel);

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'activity-qft__question-text';
      input.placeholder = i < qftMin ? `Question ${i + 1} (required)` : `Question ${i + 1} (optional)`;
      input.value = savedQuestions[i]?.text || '';
      row.appendChild(input);

      const typeSelect = document.createElement('select');
      typeSelect.className = 'activity-qft__type-select';
      typeSelect.innerHTML = '<option value="">Type</option><option value="open">Open</option><option value="closed">Closed</option>';
      if (savedQuestions[i]?.type) typeSelect.value = savedQuestions[i].type;
      row.appendChild(typeSelect);

      questionsWrap.appendChild(row);
    }
    container.appendChild(questionsWrap);

    // Validation message
    const validation = createElement('div', 'activity-qft__validation');
    container.appendChild(validation);

    // Get AI Feedback button
    const aiBtn = createElement('button', 'activity-qft__ai-btn', 'Get AI Feedback on Your Questions');
    container.appendChild(aiBtn);

    // AI feedback area
    const feedbackArea = createElement('div', 'activity-qft__feedback-area');
    feedbackArea.style.display = savedData.aiFeedback ? 'block' : 'none';
    container.appendChild(feedbackArea);

    // Restore saved AI feedback
    if (savedData.aiFeedback) {
      renderQftFeedback(feedbackArea, savedData.aiFeedback);
    }

    // Discussion notes — ALWAYS visible. AI feedback is optional, so the
    // notes textarea + Save Response button must be available regardless of
    // whether the student clicked "Get AI Feedback" first.
    const notesLabel = createElement('div', 'activity-qft__notes-label', 'Discussion notes — summarize your conversation after asking these questions face-to-face:');
    container.appendChild(notesLabel);

    const notesTextarea = document.createElement('textarea');
    notesTextarea.className = 'activity-qft__notes-textarea';
    notesTextarea.placeholder = 'After discussing your questions with your partner face-to-face, summarize the key insights here...';
    notesTextarea.value = savedData.discussionNotes || '';
    notesTextarea.rows = 5;
    container.appendChild(notesTextarea);

    // Save button — also always visible. The AI feedback path stays as an
    // optional helper above; saving never depends on it.
    const saveBtn = createElement('button', 'activity-open-ended__save-btn', savedData.discussionNotes ? 'Update Response' : 'Save Response');
    container.appendChild(saveBtn);

    // Collect questions helper
    function collectQuestions() {
      const rows = questionsWrap.querySelectorAll('.activity-qft__question-input');
      const qs = [];
      rows.forEach(row => {
        const text = row.querySelector('.activity-qft__question-text').value.trim();
        const type = row.querySelector('.activity-qft__type-select').value;
        if (text) qs.push({ text, type: type || 'open' });
      });
      return qs;
    }

    // Validate questions
    function validateQuestions(qs) {
      if (qs.length < qftMin) return `Write at least ${qftMin} questions.`;
      if (question.requireMix) {
        const hasOpen = qs.some(q => q.type === 'open');
        const hasClosed = qs.some(q => q.type === 'closed');
        if (!hasOpen || !hasClosed) return 'Include at least one Open and one Closed question.';
      }
      const untyped = qs.filter(q => !q.type || q.type === '');
      if (untyped.length > 0) return 'Select a type (Open/Closed) for each question.';
      return null;
    }

    // ---- Autosave: persist a draft on every blur / change without
    // requiring an explicit save click. Doesn't bump attempts (engine
    // skips the increment when isAutoSave is true).
    let autosaveTimer = null;
    function autosaveDraft() {
      if (autosaveTimer) clearTimeout(autosaveTimer);
      autosaveTimer = setTimeout(function() {
        const answer = {
          questions: collectQuestions(),
          aiFeedback: savedData.aiFeedback || null,
          discussionNotes: notesTextarea.value.trim(),
          phase: savedData.phase || 'draft'
        };
        savedData.questions = answer.questions;
        savedData.discussionNotes = answer.discussionNotes;
        if (typeof options.onAnswer === 'function') {
          options.onAnswer(answer, null, true);
        }
      }, 600);
    }
    questionsWrap.querySelectorAll('.activity-qft__question-text').forEach(function(el) {
      el.addEventListener('input', autosaveDraft);
      el.addEventListener('blur', autosaveDraft);
    });
    questionsWrap.querySelectorAll('.activity-qft__type-select').forEach(function(el) {
      el.addEventListener('change', autosaveDraft);
    });
    notesTextarea.addEventListener('input', autosaveDraft);
    notesTextarea.addEventListener('blur', autosaveDraft);

    // AI Feedback handler
    aiBtn.addEventListener('click', async () => {
      const qs = collectQuestions();
      const err = validateQuestions(qs);
      if (err) {
        validation.textContent = err;
        validation.style.display = 'block';
        return;
      }
      validation.style.display = 'none';

      aiBtn.disabled = true;
      aiBtn.textContent = 'Getting feedback...';

      const aiEndpoint = question.aiEndpoint || options.aiEndpoint || '/.netlify/functions/ai-proxy';
      const course = options.courseTheme === 'cst349' ? 'CST349' : 'CST395';

      // Build source text from fresh responses
      refreshSourcesPanel();
      const freshResponses = options.getAllResponses ? options.getAllResponses() : {};
      let sourceText = '';
      sourceIds.forEach(srcId => {
        const resp = freshResponses[srcId];
        if (resp?.answer) {
          const t = typeof resp.answer === 'string' ? resp.answer : (resp.answer.text || resp.answer.enteredResponse || '');
          if (t) sourceText += t + '\n\n';
        }
      });

      const systemPrompt = `You are an AI facilitator for ${course}. A student has written follow-up questions for their partner based on the partner's responses. Evaluate the quality of their questions using the Question Formulation Technique (QFT).

Respond with valid JSON only (no markdown wrapping):
{
  "assessment": "strong" or "needs_improvement",
  "overallFeedback": "1-2 sentences about the overall quality",
  "questionFeedback": [{"question": "the question text", "feedback": "specific feedback"}],
  "suggestedQuestions": ["optional additional question suggestions"]
}

If questions are strong: affirm what makes them effective and suggest 1-2 complementary questions.
If questions need work: explain specifically what's weak and suggest better alternatives.`;

      const userMsg = `Context: ${question.aiContext || ''}\n\nPartner's responses:\n${sourceText}\n\nStudent's follow-up questions:\n${qs.map((q, i) => `${i + 1}. [${q.type.toUpperCase()}] ${q.text}`).join('\n')}`;

      try {
        const resp = await fetch(aiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: systemPrompt,
            messages: [{ role: 'user', content: userMsg }],
            max_tokens: 700
          })
        });
        if (!resp.ok) throw new Error('Request failed (' + resp.status + ')');
        const raw = await resp.json();
        const feedback = parseDiscussionJson(raw.content);

        feedbackArea.style.display = 'block';
        renderQftFeedback(feedbackArea, feedback);

        // Persist to savedData so subsequent save handler can read it
        savedData.aiFeedback = feedback;
        savedData.questions = qs;

        // Auto-save questions + feedback (does not increment attempts)
        const answer = {
          questions: qs,
          aiFeedback: feedback,
          discussionNotes: notesTextarea.value.trim(),
          phase: 'discuss'
        };
        options.onAnswer(answer, null, true);

      } catch (error) {
        console.error('QFT AI error:', error);
        feedbackArea.style.display = 'block';
        feedbackArea.innerHTML = '<div class="activity-ai-discussion__error"><p><strong>Could not get feedback.</strong> ' + escapeHtml(error.message) + '</p>' +
          '<p style="margin-top:8px;font-size:13px;">You can still proceed with the discussion — ask your questions face-to-face and take notes below.</p>' +
          '<button class="activity-ai-discussion__retry-btn" onclick="this.parentElement.style.display=\'none\'">Dismiss</button></div>';
      }

      aiBtn.disabled = false;
      aiBtn.textContent = 'Get AI Feedback on Your Questions';
    });

    // Save handler
    saveBtn.addEventListener('click', () => {
      const notes = notesTextarea.value.trim();
      if (notes.length < 20) {
        alert('Please write at least a brief summary of your discussion (minimum 20 characters).');
        return;
      }
      const answer = {
        questions: collectQuestions(),
        aiFeedback: savedData.aiFeedback || null,
        discussionNotes: notes,
        phase: 'complete'
      };
      options.onAnswer(answer, null);
      updateQuestionStatus(question.id, { answer, attempts: 1, correct: null, skipped: false });
      saveBtn.textContent = 'Update Response';
    });

    return container;
  }

  function renderQftFeedback(container, feedback) {
    let html = '';
    const badge = feedback.assessment === 'strong'
      ? '<span class="activity-qft__assessment activity-qft__assessment--strong">Strong questions</span>'
      : '<span class="activity-qft__assessment activity-qft__assessment--needs-work">Needs improvement</span>';

    html += badge;
    if (feedback.overallFeedback) {
      html += '<p class="activity-qft__overall-feedback">' + escapeHtml(feedback.overallFeedback) + '</p>';
    }

    if (feedback.questionFeedback && feedback.questionFeedback.length > 0) {
      html += '<div class="activity-qft__feedback-list">';
      feedback.questionFeedback.forEach(qf => {
        html += '<div class="activity-qft__feedback-item">' +
          '<div class="activity-qft__feedback-q">' + escapeHtml(qf.question) + '</div>' +
          '<div class="activity-qft__feedback-text">' + escapeHtml(qf.feedback) + '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    if (feedback.suggestedQuestions && feedback.suggestedQuestions.length > 0) {
      html += '<div class="activity-qft__suggestions">' +
        '<div class="activity-qft__suggestions-label">Suggested additional questions:</div>' +
        '<ul>';
      feedback.suggestedQuestions.forEach(sq => {
        html += '<li>' + escapeHtml(sq) + '</li>';
      });
      html += '</ul></div>';
    }

    container.innerHTML = html;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // Public API
  // ============================================

  return {
    renderQuestion,
    updateQuestionStatus
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ActivityComponents;
}

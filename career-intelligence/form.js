/**
 * Career Discovery Form v5 — UI & State Machine
 *
 * 3 stages with AI deepening, transitions, two-part synthesis
 * (Career Brief + Pitch), optional reaction, collapsible brief sections.
 */
import { CONFIG, PROGRAM_CONFIG } from './config.js';
import { STAGE_1_FRAME, STAGE_1_QUESTION, STAGE_2_QUESTION, STAGE_3_BANK } from './questions.js';
import { SYSTEM_PROMPT } from './prompts.js';
import { callAI, parsePhaseResponse, fixJsonStringNewlines, extractBriefValue } from './api.js';
import { downloadJSON, generateBriefText } from './data.js';

// ============================================
// Stage Metadata & Icons
// ============================================

const STAGES = [
  { num: 1, label: 'Your Situation', color: '#2c5282' },
  { num: 2, label: 'Recruiter Perspective', color: '#6b46c1' },
  { num: 3, label: 'Your Direction', color: '#b7791f' },
];

const ICONS = {
  1: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  2: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  3: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
};

// Brief section icons (used in collapsible card)
const BRIEF_ICONS = {
  'Where You Are': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  'What I See': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  'A Direction Worth Exploring': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
  'Your First Move': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>',
};

const BRIEF_COLORS = {
  'Where You Are': '#2c5282',
  'What I See': '#6b46c1',
  'A Direction Worth Exploring': '#b7791f',
  'Your First Move': '#276749',
};

// ============================================
// State
// ============================================

const STORAGE_KEY = 'ci-form-state';

const state = {
  currentStage: 1,
  followUpCount: 0,
  messages: [],
  conversation: [],
  selectedQ3: null,
  briefText: null,
  pitchText: null,
  synthesisReaction: null,
  synthesisAdjustment: null,
  transitions: { s1_to_s2: null, s2_to_s3: null },
  timestamps: { start: new Date().toISOString(), end: null },
  tokenUsage: { input: 0, output: 0 },
  tracking: [],
  complete: false,
};

// ============================================
// LocalStorage Persistence
// ============================================

const PERSISTED_KEYS = [
  'currentStage', 'followUpCount', 'messages', 'conversation',
  'selectedQ3', 'briefText', 'pitchText', 'synthesisReaction',
  'synthesisAdjustment', 'transitions', 'timestamps', 'tokenUsage',
  'tracking', 'complete',
];

function saveState() {
  try {
    const snapshot = {};
    for (const key of PERSISTED_KEYS) {
      snapshot[key] = state[key];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const snapshot = JSON.parse(raw);
    // Basic validity check — must have conversation entries
    if (!snapshot.conversation || snapshot.conversation.length === 0) return null;
    return snapshot;
  } catch {
    return null;
  }
}

function applySavedState(snapshot) {
  for (const key of PERSISTED_KEYS) {
    if (key in snapshot) {
      state[key] = snapshot[key];
    }
  }
}

function clearSavedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

// ============================================
// Helpers
// ============================================

function getSystemPrompt() {
  return SYSTEM_PROMPT
    .replace(/{DATES_PLACEHOLDER}/g, CONFIG.dates_placeholder);
}

function getStageQuestion() {
  if (state.currentStage === 1) return STAGE_1_QUESTION;
  if (state.currentStage === 2) return STAGE_2_QUESTION;
  if (state.currentStage === 3 && state.selectedQ3) return STAGE_3_BANK[state.selectedQ3].text;
  return '';
}

function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html) e.innerHTML = html;
  return e;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderMarkdown(text) {
  const lines = text.split('\n');
  const result = [];
  let inList = false;

  for (const line of lines) {
    if (line.match(/^---+\s*$/)) {
      if (inList) { result.push('</ul>'); inList = false; }
    } else if (line.match(/^## /)) {
      if (inList) { result.push('</ul>'); inList = false; }
      const heading = escapeHtml(line.slice(3));
      result.push(`<h3>${heading}</h3>`);
    } else if (line.match(/^- /)) {
      if (!inList) { result.push('<ul>'); inList = true; }
      const content = escapeHtml(line.slice(2)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      result.push(`<li>${content}</li>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      let processed = escapeHtml(line).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      if (processed.trim() === '') continue;
      result.push(`<p>${processed}</p>`);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('\n');
}

// ============================================
// Progress Bar
// ============================================

function renderProgressBar() {
  const bar = el('div', 'ci-progress');
  bar.id = 'ci-progress';

  const label = el('div', 'ci-progress__label-top', '3 Stages');
  bar.appendChild(label);

  const track = el('div', 'ci-progress__track');

  STAGES.forEach((stage, i) => {
    const stepEl = el('div', 'ci-progress__step ci-progress__step--upcoming');
    stepEl.dataset.step = stage.num;
    stepEl.innerHTML = `
      <div class="ci-progress__dot" style="--step-color: ${stage.color}">
        <span class="ci-progress__icon">${ICONS[stage.num]}</span>
        <span class="ci-progress__check">${ICONS.check}</span>
      </div>
      <div class="ci-progress__label">${stage.label}</div>
    `;
    track.appendChild(stepEl);

    if (i < STAGES.length - 1) {
      track.appendChild(el('div', 'ci-progress__connector'));
    }
  });

  bar.appendChild(track);

  const form = document.getElementById('ci-form');
  form.parentNode.insertBefore(bar, form);
}

function updateProgress(activeStage) {
  document.querySelectorAll('.ci-progress__step').forEach(stepEl => {
    const num = parseInt(stepEl.dataset.step);
    stepEl.classList.remove('ci-progress__step--done', 'ci-progress__step--active', 'ci-progress__step--upcoming');
    if (num < activeStage) {
      stepEl.classList.add('ci-progress__step--done');
    } else if (num === activeStage) {
      stepEl.classList.add('ci-progress__step--active');
    } else {
      stepEl.classList.add('ci-progress__step--upcoming');
    }
  });

  document.querySelectorAll('.ci-progress__connector').forEach((conn, i) => {
    conn.classList.toggle('ci-progress__connector--done', i < activeStage - 1);
  });
}

// ============================================
// UI Rendering
// ============================================

function getForm() {
  return document.getElementById('ci-form');
}

function getActiveStageEl() {
  return document.querySelector('.ci-stage--active');
}

function renderStageStart(stageNum, questionText, transitionText) {
  const prev = getActiveStageEl();
  if (prev) {
    prev.classList.remove('ci-stage--active');
    prev.classList.add('ci-stage--done');
  }

  const meta = STAGES[stageNum - 1];
  const stage = el('div', 'ci-stage ci-stage--active');
  stage.dataset.stage = stageNum;
  stage.style.setProperty('--step-color', meta.color);

  // Stage header
  const header = el('div', 'ci-stage-header');
  header.innerHTML = `
    <span class="ci-stage-header__icon">${ICONS[stageNum]}</span>
    <span class="ci-stage-header__num">Stage ${stageNum}</span>
    <span class="ci-stage-header__title">${meta.label}</span>
  `;
  stage.appendChild(header);

  // Transition text (from previous stage advance)
  if (transitionText) {
    const trans = el('div', 'ci-transition');
    trans.innerHTML = `<p>${escapeHtml(transitionText)}</p>`;
    stage.appendChild(trans);
  }

  // Stage 1 frame text
  if (stageNum === 1) {
    const frame = el('div', 'ci-stage-frame');
    frame.innerHTML = `<p>${escapeHtml(STAGE_1_FRAME)}</p>`;
    stage.appendChild(frame);
  }

  // Question card
  const qCard = el('div', 'ci-question');
  qCard.innerHTML = `<p>${escapeHtml(questionText)}</p>`;
  stage.appendChild(qCard);

  getForm().appendChild(stage);

  // Input area
  appendInputArea(stage);

  // Update progress
  updateProgress(stageNum);

  // Scroll to stage
  stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function appendInputArea(container) {
  const existing = container.querySelector('.ci-input-area');
  if (existing) existing.remove();

  const area = el('div', 'ci-input-area');

  const textarea = document.createElement('textarea');
  textarea.className = 'ci-textarea';
  textarea.placeholder = CONFIG.placeholder_text;
  textarea.rows = 5;
  area.appendChild(textarea);

  const btnRow = el('div', 'ci-btn-row');

  const submitBtn = el('button', 'ci-submit', 'Submit');
  submitBtn.disabled = true;
  btnRow.appendChild(submitBtn);

  // Skip button after 2 follow-ups
  if (state.followUpCount >= 2) {
    const skipBtn = el('button', 'ci-skip', "I've shared enough — let's move on");
    skipBtn.addEventListener('click', () => handleSkip());
    btnRow.appendChild(skipBtn);
  }

  area.appendChild(btnRow);
  container.appendChild(area);

  // Character count hint
  const hint = el('div', 'ci-char-hint', '');
  area.appendChild(hint);

  const MIN_CHARS = 20;

  function checkInput() {
    const len = textarea.value.trim().length;
    submitBtn.disabled = len < MIN_CHARS;
    if (len > 0 && len < MIN_CHARS) {
      hint.textContent = `${MIN_CHARS - len} more characters needed`;
      hint.style.display = '';
    } else {
      hint.style.display = 'none';
    }
  }

  textarea.addEventListener('input', checkInput);
  textarea.addEventListener('keyup', checkInput);
  textarea.addEventListener('change', checkInput);
  textarea.addEventListener('paste', () => setTimeout(checkInput, 0));

  submitBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (text.length < MIN_CHARS) return;
    handleSubmit(text, area);
  });

  setTimeout(() => textarea.focus(), 300);
}

function renderStudentBubble(container, text) {
  const bubble = el('div', 'ci-student-response');
  bubble.innerHTML = `<p>${escapeHtml(text)}</p>`;
  container.appendChild(bubble);
  requestAnimationFrame(() => bubble.classList.add('ci-student-response--visible'));
  return bubble;
}

function textContainsSynthesisData(text) {
  if (typeof text !== 'string') return false;
  return (
    (text.includes('"brief"') && (text.includes('"pitch"') || text.includes('"phase"'))) ||
    (text.includes('"Where You Are"') && text.includes('"What I See"')) ||
    (text.includes('"A Direction Worth Exploring"') && text.includes('"First Move"'))
  );
}

function textLooksSynthesisLike(text) {
  if (typeof text !== 'string') return false;
  const markers = [
    '## Where You Are', '## What I See',
    '## A Direction Worth Exploring', '## Your First Move',
    '## Your Situation', '## Your Strongest Positioning',
  ];
  return markers.filter(m => text.includes(m)).length >= 2;
}

function renderAIBubble(container, reaction, followUp) {
  // GUARD: Block synthesis data from rendering as a conversation bubble.
  // When the AI returns synthesis inline (during Stage 3 instead of a
  // separate synthesis call), we must extract the brief/pitch and render
  // the brief properly — otherwise requestSynthesis() fires again and
  // the AI says "already generated."
  if (textContainsSynthesisData(reaction) || textLooksSynthesisLike(reaction)) {
    let synthesisHandled = false;

    // Try 1: Use the resilient JSON parser
    const parsed = parsePhaseResponse(reaction);
    if (parsed.brief || parsed.pitch) {
      state.briefText = state.briefText || parsed.brief || '';
      state.pitchText = state.pitchText || parsed.pitch || '';
      synthesisHandled = true;
    }

    // Try 2: Marker-based extraction (handles unescaped quotes that break JSON)
    if (!synthesisHandled) {
      const markerResult = extractBriefByMarkers(reaction);
      if (markerResult && markerResult.brief) {
        state.briefText = state.briefText || markerResult.brief;
        state.pitchText = state.pitchText || markerResult.pitch || '';
        synthesisHandled = true;
      }
    }

    // Try 3: Direct regex extraction of "brief" field value (nuclear option)
    if (!synthesisHandled) {
      const directBrief = extractBriefValue(reaction);
      if (directBrief) {
        state.briefText = state.briefText || directBrief;
        synthesisHandled = true;
      }
    }

    // Try 4: If the text IS synthesis markdown (not JSON-wrapped), use directly
    if (!synthesisHandled && textLooksSynthesisLike(reaction) && !reaction.trimStart().startsWith('{')) {
      state.briefText = state.briefText || reaction;
      synthesisHandled = true;
    }

    // Render the brief if we extracted content and it hasn't been rendered yet
    if (synthesisHandled && state.briefText && !document.querySelector('.ci-synthesis-section')) {
      state.currentStage = 'synthesis';
      saveState();

      const stageEl = getActiveStageEl();
      if (stageEl) {
        stageEl.classList.remove('ci-stage--active');
        stageEl.classList.add('ci-stage--done');
      }
      updateProgress(4);
      renderBrief(state.briefText);
    }

    // If extraction failed entirely and it's JSON-wrapped, DON'T set briefText
    // to raw JSON — let requestSynthesis() retry instead.
    return;
  }

  const bubble = el('div', 'ci-reaction');
  let html = `<p>${escapeHtml(reaction)}</p>`;
  if (followUp) {
    html += `<p class="ci-follow-up">${escapeHtml(followUp)}</p>`;
  }
  bubble.innerHTML = html;
  container.appendChild(bubble);
  requestAnimationFrame(() => bubble.classList.add('ci-reaction--visible'));
}

function showLoading(container, message) {
  const loading = el('div', 'ci-loading');
  let html = '<span class="ci-loading__dot"></span><span class="ci-loading__dot"></span><span class="ci-loading__dot"></span>';
  if (message) {
    html += `<span class="ci-loading__message">${escapeHtml(message)}</span>`;
  }
  loading.innerHTML = html;
  container.appendChild(loading);
  return loading;
}

function showError(container, message, onRetry, onDownload) {
  const errorEl = el('div', 'ci-error');
  let html = `<p><strong>Something went wrong.</strong> ${escapeHtml(message)}</p>`;
  html += '<div class="ci-btn-row">';
  if (onRetry) {
    html += '<button class="ci-error__retry">Try again</button>';
  }
  if (onDownload) {
    html += '<button class="ci-error__download">Download your responses as-is</button>';
  }
  html += '</div>';
  errorEl.innerHTML = html;
  container.appendChild(errorEl);

  if (onRetry) {
    errorEl.querySelector('.ci-error__retry').addEventListener('click', () => {
      errorEl.remove();
      onRetry();
    });
  }
  if (onDownload) {
    errorEl.querySelector('.ci-error__download').addEventListener('click', () => {
      onDownload();
    });
  }
}

// ============================================
// Submit Handler
// ============================================

async function handleSubmit(text, inputArea) {
  const stageEl = getActiveStageEl();
  const stage = state.currentStage;
  const timestamp = new Date().toISOString();

  const textarea = inputArea.querySelector('.ci-textarea');
  const submitBtn = inputArea.querySelector('.ci-submit');
  textarea.disabled = true;
  submitBtn.disabled = true;

  inputArea.remove();
  const bubble = renderStudentBubble(stageEl, text);

  // Build context-labeled message
  const questionText = getStageQuestion();
  let contextLabel;
  if (state.followUpCount === 0) {
    contextLabel = `[Stage ${stage} | Response 1 | Question: "${questionText}"]`;
  } else {
    const lastAI = [...state.conversation].reverse().find(
      e => e.role === 'ai' && e.stage === stage
    );
    const fq = lastAI?.follow_up || questionText;
    contextLabel = `[Stage ${stage} | Follow-up ${state.followUpCount} response | Question: "${fq}"]`;
  }

  const userMessage = `${contextLabel}\n${text}`;
  state.messages.push({ role: 'user', content: userMessage });
  state.conversation.push({
    role: 'student',
    content: text,
    stage: stage,
    timestamp: timestamp,
  });

  // Determine if this could be a synthesis call (Stage 3 with enough material)
  const isSynthesis = stage === 3;
  const loadingMsg = isSynthesis ? 'Putting together your personalized summary — this takes a moment...' : null;
  const loading = showLoading(stageEl, loadingMsg);

  try {
    const result = await callAI(getSystemPrompt(), state.messages, { isSynthesis });

    state.tokenUsage.input += result.usage.input_tokens || 0;
    state.tokenUsage.output += result.usage.output_tokens || 0;

    const parsed = parsePhaseResponse(result.content);
    state.messages.push({ role: 'assistant', content: result.content });

    loading.remove();
    processAIResponse(parsed, stageEl);

  } catch (error) {
    loading.remove();
    state.messages.pop();
    state.conversation.pop();
    bubble.remove();

    if (isSynthesis) {
      // For synthesis failures, offer retry + download-as-is
      showError(stageEl,
        "We weren't able to generate your summary right now. Your responses have been saved.",
        () => {
          appendInputArea(stageEl);
          const newTextarea = stageEl.querySelector('.ci-textarea');
          if (newTextarea) newTextarea.value = text;
        },
        () => {
          state.timestamps.end = new Date().toISOString();
          downloadJSON(state);
        }
      );
    } else {
      showError(stageEl, error.message, () => {
        appendInputArea(stageEl);
        const newTextarea = stageEl.querySelector('.ci-textarea');
        if (newTextarea) newTextarea.value = text;
      });
    }
  }
}

// ============================================
// AI Response Processing
// ============================================

function processAIResponse(parsed, stageEl) {
  const stage = state.currentStage;

  if (parsed.phase === 'deepening') {
    state.conversation.push({
      role: 'ai',
      content: parsed.reaction + (parsed.follow_up ? '\n\n' + parsed.follow_up : ''),
      stage: stage,
      phase: 'deepening',
      reaction: parsed.reaction,
      follow_up: parsed.follow_up,
    });

    state.followUpCount++;
    saveState();
    renderAIBubble(stageEl, parsed.reaction, parsed.follow_up);
    appendInputArea(stageEl);

  } else if (parsed.phase === 'synthesis') {
    // Handle synthesis BEFORE advance — the AI may return synthesis directly
    // from Stage 3 instead of returning "advance" first. This must be caught
    // before the advance handler to prevent raw JSON rendering as a bubble.
    const briefText = parsed.brief || parsed.synthesis || '';
    const pitchText = parsed.pitch || '';

    state.briefText = briefText;
    state.pitchText = pitchText;
    state.currentStage = 'synthesis';

    state.conversation.push({
      role: 'ai',
      content: briefText,
      stage: 'synthesis',
      phase: 'synthesis',
    });

    stageEl.classList.remove('ci-stage--active');
    stageEl.classList.add('ci-stage--done');
    updateProgress(4);
    saveState();

    renderBrief(briefText);
    return; // Do NOT fall through to advance or any other handler

  } else if (parsed.phase === 'advance') {
    // GUARD: Check if synthesis data is piggybacking on an advance response
    if (parsed.brief || parsed.pitch) {
      state.briefText = parsed.brief || '';
      state.pitchText = parsed.pitch || '';
      state.currentStage = 'synthesis';

      state.conversation.push({
        role: 'ai',
        content: state.briefText,
        stage: 'synthesis',
        phase: 'synthesis',
      });

      stageEl.classList.remove('ci-stage--active');
      stageEl.classList.add('ci-stage--done');
      updateProgress(4);
      saveState();
      renderBrief(state.briefText);
      return;
    }

    state.conversation.push({
      role: 'ai',
      content: parsed.reaction || '',
      stage: stage,
      phase: 'advance',
      reaction: parsed.reaction || '',
      follow_up: null,
      next_question_id: parsed.next_question_id || null,
      transition: parsed.transition || null,
    });

    if (parsed.reaction) {
      renderAIBubble(stageEl, parsed.reaction, null);
    }

    saveState();
    advanceFromStage(stage, parsed.next_question_id, parsed.transition);

  } else if (parsed.phase === 'synthesis_adjusted') {
    state.synthesisAdjustment = parsed.reaction;

    state.conversation.push({
      role: 'ai',
      content: parsed.reaction,
      stage: 'synthesis',
      phase: 'synthesis_adjusted',
    });

    saveState();
    renderSynthesisAdjustment(parsed.reaction);
    renderPostReactionActions();
  }
}

function advanceFromStage(stage, nextQuestionId, transition) {
  if (stage === 1) {
    state.transitions.s1_to_s2 = transition || null;
    state.currentStage = 2;
    state.followUpCount = 0;
    renderStageStart(2, STAGE_2_QUESTION, transition);
  } else if (stage === 2) {
    state.transitions.s2_to_s3 = transition || null;
    state.selectedQ3 = nextQuestionId || 'q3_e';
    state.currentStage = 3;
    state.followUpCount = 0;
    const q3 = STAGE_3_BANK[state.selectedQ3];
    renderStageStart(3, q3 ? q3.text : '', transition);
  } else if (stage === 3) {
    requestSynthesis();
  }
}

async function requestSynthesis() {
  // Guard: don't request if synthesis was already generated inline
  if (state.briefText || state.currentStage === 'synthesis') return;

  state.currentStage = 'synthesis';
  updateProgress(4);

  const stageEl = getActiveStageEl();
  if (stageEl) {
    stageEl.classList.remove('ci-stage--active');
    stageEl.classList.add('ci-stage--done');
  }

  state.messages.push({
    role: 'user',
    content: '[All stages complete — generate synthesis]',
  });

  const form = getForm();
  const loading = showLoading(form, 'Putting together your personalized summary — this takes a moment...');

  try {
    const result = await callAI(getSystemPrompt(), state.messages, { isSynthesis: true });

    state.tokenUsage.input += result.usage.input_tokens || 0;
    state.tokenUsage.output += result.usage.output_tokens || 0;

    const parsed = parsePhaseResponse(result.content);
    state.messages.push({ role: 'assistant', content: result.content });

    loading.remove();

    // Extract brief text — never fall back to raw reaction/content, as that
    // may be the full JSON response string. If parsing extracted the brief
    // field, use it. Otherwise let renderBrief's safety net handle it.
    let briefText = parsed.brief || parsed.synthesis || '';
    let pitchText = parsed.pitch || '';

    // If the parser failed to extract a brief (all attempts returned the
    // fallback), pass the raw content so renderBrief's safety net can
    // try its own extraction strategies.
    if (!briefText && result.content) {
      briefText = result.content;
    }

    state.briefText = briefText;
    state.pitchText = pitchText;

    state.conversation.push({
      role: 'ai',
      content: briefText,
      stage: 'synthesis',
      phase: 'synthesis',
    });

    saveState();
    renderBrief(briefText);

  } catch (error) {
    loading.remove();
    showError(form,
      "We weren't able to generate your summary right now. Your responses have been saved.",
      () => requestSynthesis(),
      () => {
        state.timestamps.end = new Date().toISOString();
        downloadJSON(state);
      }
    );
  }
}

// ============================================
// Skip Handler
// ============================================

async function handleSkip() {
  const stage = state.currentStage;
  const stageEl = getActiveStageEl();

  const inputArea = stageEl.querySelector('.ci-input-area');
  if (inputArea) inputArea.remove();

  const skipMessage = `[Stage ${stage} | Student chose to continue to next stage]`;
  state.messages.push({ role: 'user', content: skipMessage });
  state.conversation.push({
    role: 'student',
    content: '[Continued to next stage]',
    stage: stage,
    timestamp: new Date().toISOString(),
    skipped: true,
  });

  if (stage === 1) {
    state.currentStage = 2;
    state.followUpCount = 0;
    saveState();
    renderStageStart(2, STAGE_2_QUESTION, null);
    return;
  }

  const isSynthesis = stage === 3;
  const loadingMsg = isSynthesis ? 'Putting together your personalized summary — this takes a moment...' : null;
  const loading = showLoading(stageEl, loadingMsg);

  try {
    const result = await callAI(getSystemPrompt(), state.messages, { isSynthesis });

    state.tokenUsage.input += result.usage.input_tokens || 0;
    state.tokenUsage.output += result.usage.output_tokens || 0;

    const parsed = parsePhaseResponse(result.content);
    state.messages.push({ role: 'assistant', content: result.content });

    loading.remove();
    processAIResponse(parsed, stageEl);

  } catch (error) {
    loading.remove();
    state.messages.pop();
    state.conversation.pop();

    showError(stageEl, error.message, () => {
      appendInputArea(stageEl);
    });
  }
}

// ============================================
// Career Intelligence Brief (Collapsible)
// ============================================

function parseBriefSections(markdown) {
  const sections = [];
  const lines = markdown.split('\n');
  let currentTitle = '';
  let currentContent = [];

  for (const line of lines) {
    if (line.match(/^#{1,3}\s/)) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
      }
      currentTitle = line.replace(/^#{1,3}\s+/, '').trim();
      currentContent = [];
    } else if (line.match(/^---+\s*$/)) {
      // skip separators
    } else {
      currentContent.push(line);
    }
  }
  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
  }

  return sections;
}

function extractBriefByMarkers(raw) {
  // Find the brief markdown content using ## section headings as anchors.
  // This bypasses JSON parsing entirely — works even when the AI's prose
  // contains unescaped double quotes that break JSON structure.
  const FIRST_HEADINGS = ['## Where You Are', '## Your Situation'];
  let start = -1;
  for (const heading of FIRST_HEADINGS) {
    const idx = raw.indexOf(heading);
    if (idx !== -1) { start = idx; break; }
  }
  if (start === -1) return null;

  // Find where the brief content ends. The brief is followed by either:
  // - The "pitch" JSON field: ...", "pitch": "..."
  // - End of JSON object: ..."}
  // We look for patterns that signal we've left the brief's markdown.
  // Since quotes may be unescaped, we look for JSON key patterns after
  // the last known brief section (## Your First Move).
  let end = raw.length;

  // Look for common JSON field boundaries after the brief content.
  // These patterns include the closing quote of the brief value + next key.
  const BOUNDARIES = [
    /",\s*"pitch"\s*:/,
    /",\s*"phase"\s*:/,
    /",\s*"reaction"\s*:/,
    /",\s*"follow_up"\s*:/,
    /",\s*"next_question_id"\s*:/,
  ];

  // Search for boundaries, but only AFTER we've seen enough content
  // (at least past the first heading) to avoid false matches
  const searchFrom = start + 50;
  for (const boundary of BOUNDARIES) {
    const match = raw.substring(searchFrom).match(boundary);
    if (match) {
      const boundaryPos = searchFrom + match.index;
      if (boundaryPos > start) {
        end = Math.min(end, boundaryPos);
      }
    }
  }

  // Also check for the JSON closing pattern at the very end
  const trailingClose = raw.match(/"\s*}\s*$/);
  if (trailingClose) {
    const closePos = raw.length - trailingClose[0].length;
    if (closePos > start) {
      end = Math.min(end, closePos);
    }
  }

  let brief = raw.substring(start, end);
  // Unescape JSON string escapes: \\n → newline, \\" → ", \\\\ → \\
  brief = brief.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

  // Extract pitch the same way if present
  let pitch = null;
  const pitchKeyIdx = raw.indexOf('"pitch"', end);
  if (pitchKeyIdx !== -1) {
    // Find the pitch value start (after "pitch": ")
    const pitchValMatch = raw.substring(pitchKeyIdx).match(/"pitch"\s*:\s*"/);
    if (pitchValMatch) {
      const pitchStart = pitchKeyIdx + pitchValMatch[0].length;
      // Pitch ends at the next JSON field or end of object
      let pitchEnd = raw.length;
      const pitchBoundaries = [/",\s*"(?:phase|reaction|brief|follow_up)"\s*:/, /"\s*}\s*$/];
      for (const pb of pitchBoundaries) {
        const pm = raw.substring(pitchStart).match(pb);
        if (pm) {
          pitchEnd = Math.min(pitchEnd, pitchStart + pm.index);
        }
      }
      pitch = raw.substring(pitchStart, pitchEnd);
      pitch = pitch.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
  }

  return { brief, pitch };
}

function renderBrief(briefMarkdown) {
  // Safety net: if briefMarkdown is raw JSON or contains JSON-wrapped content,
  // extract the "brief" field before rendering.
  if (typeof briefMarkdown === 'string' && briefMarkdown.trimStart().startsWith('{')) {
    let extracted = null;

    // Strategy 1: direct JSON.parse (works when JSON is well-formed)
    try {
      extracted = JSON.parse(briefMarkdown);
    } catch { /* continue */ }

    // Strategy 2: fix literal newlines inside string values, then parse
    if (!extracted) {
      try {
        extracted = JSON.parse(fixJsonStringNewlines(briefMarkdown));
      } catch { /* continue */ }
    }

    // Strategy 3: marker-based extraction — bypasses JSON parsing entirely.
    // Handles unescaped double quotes in the AI's prose advice that break
    // JSON structure (e.g. Replace "X" with "Y" in resume bullets).
    if (!extracted || !extracted.brief) {
      const markerResult = extractBriefByMarkers(briefMarkdown);
      if (markerResult && markerResult.brief) {
        extracted = markerResult;
      }
    }

    // Strategy 4 (nuclear): regex extraction of the "brief" field value.
    // This is the last resort — it finds "brief": " in the raw string and
    // reads until the next JSON field boundary.
    if (!extracted || !extracted.brief) {
      const directBrief = extractBriefValue(briefMarkdown);
      if (directBrief) {
        extracted = { brief: directBrief };
      }
    }

    if (extracted && extracted.brief) {
      briefMarkdown = extracted.brief;
      // Normalize any remaining \\n to actual newlines
      if (typeof briefMarkdown === 'string') {
        briefMarkdown = briefMarkdown.replace(/\\n/g, '\n');
      }
      state.briefText = briefMarkdown;
      if (extracted.pitch && !state.pitchText) {
        state.pitchText = typeof extracted.pitch === 'string'
          ? extracted.pitch.replace(/\\n/g, '\n')
          : extracted.pitch;
      }
      saveState();
    } else {
      // Absolute last resort: strip JSON structural characters to prevent
      // rendering raw JSON. This loses some formatting but is far better
      // than showing raw JSON to the user.
      briefMarkdown = briefMarkdown
        .replace(/^\s*\{/, '').replace(/\}\s*$/, '')
        .replace(/"(?:reaction|follow_up|phase|next_question_id)"\s*:\s*(?:null|"[^"]*")\s*,?\s*/g, '')
        .replace(/"brief"\s*:\s*"/, '').replace(/"pitch"\s*:\s*".*$/, '')
        .replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
        .trim();
      state.briefText = briefMarkdown;
      saveState();
    }
  }

  const form = getForm();
  const section = el('div', 'ci-synthesis-section');

  // Header
  const synthHeader = el('div', 'ci-synth-header');
  synthHeader.innerHTML = `
    <h2 class="ci-synth-header__title">Your Career Intelligence Brief</h2>
    <p class="ci-synth-header__subtitle">Based on everything you shared across all three stages</p>
  `;
  section.appendChild(synthHeader);

  // Collapsible brief card
  const briefCard = el('div', 'ci-brief-card');
  const sections = parseBriefSections(briefMarkdown);

  if (sections.length === 0) {
    // Fallback: render as plain markdown if parsing finds no sections
    briefCard.innerHTML = renderMarkdown(briefMarkdown);
  } else {
    sections.forEach((s, index) => {
      const sectionEl = el('div', `ci-brief-section ${index === 0 ? 'ci-brief-section--expanded' : ''}`);

      const icon = BRIEF_ICONS[s.title] || '';
      const color = BRIEF_COLORS[s.title] || '#4a5568';

      // Extract first sentence for preview, stripping markdown markers
      const stripped = s.content
        .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/_(.*?)_/g, '$1');
      const firstSentence = stripped.split(/(?<=[.!?])\s/)[0] || '';

      const headerEl = el('div', 'ci-brief-section__header');
      headerEl.style.setProperty('--section-color', color);
      headerEl.innerHTML = `
        <div class="ci-brief-section__title-row">
          ${icon ? `<span class="ci-brief-section__icon" style="color:${color}">${icon}</span>` : ''}
          <div>
            <h3 class="ci-brief-section__title">${escapeHtml(s.title)}</h3>
            ${index > 0 ? `<span class="ci-brief-section__preview">${escapeHtml(firstSentence)}</span>` : ''}
          </div>
        </div>
        <span class="ci-brief-section__toggle">\u25BE</span>
      `;

      const contentEl = el('div', 'ci-brief-section__content');
      contentEl.innerHTML = renderMarkdown(s.content);

      headerEl.addEventListener('click', () => {
        sectionEl.classList.toggle('ci-brief-section--expanded');
      });

      sectionEl.appendChild(headerEl);
      sectionEl.appendChild(contentEl);
      briefCard.appendChild(sectionEl);
    });
  }

  section.appendChild(briefCard);
  requestAnimationFrame(() => briefCard.classList.add('ci-brief-card--visible'));

  form.appendChild(section);

  // Reaction area
  renderSynthesisReactionArea(section);

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// Synthesis Reaction
// ============================================

function renderSynthesisReactionArea(container) {
  const area = el('div', 'ci-synthesis-reaction');
  area.innerHTML = `
    <p class="ci-synthesis-reaction__prompt">Does anything here surprise you or feel off? Tell me what and I'll adjust.</p>
  `;

  const textarea = document.createElement('textarea');
  textarea.className = 'ci-textarea';
  textarea.placeholder = 'Tell me what surprised you or felt off...';
  textarea.rows = 3;
  area.appendChild(textarea);

  const btnRow = el('div', 'ci-btn-row');

  const submitBtn = el('button', 'ci-submit', 'Submit feedback');
  submitBtn.disabled = true;
  btnRow.appendChild(submitBtn);

  const skipBtn = el('button', 'ci-skip', 'Looks good, continue');
  btnRow.appendChild(skipBtn);

  area.appendChild(btnRow);
  container.appendChild(area);

  textarea.addEventListener('input', () => {
    submitBtn.disabled = textarea.value.trim().length < 5;
  });

  submitBtn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (text.length < 5) return;

    textarea.disabled = true;
    submitBtn.disabled = true;
    skipBtn.disabled = true;

    state.synthesisReaction = text;

    state.messages.push({
      role: 'user',
      content: `[Synthesis reaction]\nStudent's response: "${text}"`,
    });
    state.conversation.push({
      role: 'student',
      content: text,
      stage: 'synthesis',
      timestamp: new Date().toISOString(),
    });

    btnRow.remove();
    textarea.style.display = 'none';
    const prompt = area.querySelector('.ci-synthesis-reaction__prompt');
    if (prompt) prompt.style.display = 'none';

    renderStudentBubble(area, text);
    const loading = showLoading(area);

    try {
      const result = await callAI(getSystemPrompt(), state.messages);

      state.tokenUsage.input += result.usage.input_tokens || 0;
      state.tokenUsage.output += result.usage.output_tokens || 0;

      const parsed = parsePhaseResponse(result.content);
      state.messages.push({ role: 'assistant', content: result.content });

      loading.remove();

      state.synthesisAdjustment = parsed.reaction || result.content;
      state.conversation.push({
        role: 'ai',
        content: state.synthesisAdjustment,
        stage: 'synthesis',
        phase: 'synthesis_adjusted',
      });

      saveState();
      renderSynthesisAdjustment(state.synthesisAdjustment);
      renderPostReactionActions();

    } catch (error) {
      loading.remove();
      showError(area, error.message);
      renderPostReactionActions();
    }
  });

  skipBtn.addEventListener('click', () => {
    area.remove();
    state.synthesisReaction = null;
    state.synthesisAdjustment = null;
    saveState();
    renderPostReactionActions();
  });
}

function renderSynthesisAdjustment(adjustmentText) {
  const section = document.querySelector('.ci-synthesis-section');
  const adj = el('div', 'ci-adjustment');
  adj.innerHTML = `<p>${escapeHtml(adjustmentText)}</p>`;
  section.appendChild(adj);
  requestAnimationFrame(() => adj.classList.add('ci-adjustment--visible'));
}

// ============================================
// Post-Reaction: Pitch + Program + Copy + Download
// ============================================

function trackEvent(eventName) {
  state.tracking.push({ event: eventName, timestamp: new Date().toISOString() });
}

function renderPostReactionActions() {
  state.timestamps.end = new Date().toISOString();
  state.currentStage = 'complete';
  state.complete = true;
  saveState();

  const section = document.querySelector('.ci-synthesis-section');

  // 1. Show AI pitch text automatically
  if (state.pitchText) {
    const pitchEl = el('div', 'ci-pitch-text');
    pitchEl.innerHTML = renderMarkdown(state.pitchText);
    section.appendChild(pitchEl);
    requestAnimationFrame(() => pitchEl.classList.add('ci-pitch-text--visible'));
  }

  // 2. Bridge sentence connecting synthesis to program
  const bridge = el('p', 'ci-bridge-text',
    'The direction identified in your brief above is a starting point. ' +
    'The Career Intelligence Program helps you build a full strategy around it — ' +
    'mapping the market, developing your positioning, and running real experiments to test what works.'
  );
  section.appendChild(bridge);

  // 3. "Learn about CTI's career programs" button
  const programBtn = el('button', 'ci-program-btn', "Learn about CTI's career programs for graduating seniors");
  section.appendChild(programBtn);

  // 3. Program description (hidden until button click)
  const programDesc = el('div', 'ci-program-desc');
  programDesc.innerHTML = `
    <h3>${escapeHtml(PROGRAM_CONFIG.program_name)}</h3>
    <p class="ci-program-desc__meta">${escapeHtml(PROGRAM_CONFIG.dates)} · ${escapeHtml(PROGRAM_CONFIG.session_times)}</p>
    ${renderMarkdown(PROGRAM_CONFIG.description)}
  `;
  programDesc.style.display = 'none';
  section.appendChild(programDesc);

  programBtn.addEventListener('click', () => {
    trackEvent('program_button_clicked');
    programBtn.style.display = 'none';
    programDesc.style.display = '';
    requestAnimationFrame(() => programDesc.classList.add('ci-program-desc--visible'));
    programDesc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // 4. Action buttons: Copy Brief + Download JSON
  const actions = el('div', 'ci-actions ci-final-actions');

  const copyBtn = el('button', 'ci-copy-btn', 'Copy Brief to Clipboard');
  copyBtn.addEventListener('click', async () => {
    trackEvent('copy_brief_clicked');
    const briefText = generateBriefText(state);
    try {
      await navigator.clipboard.writeText(briefText);
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('ci-copy-btn--success');
      setTimeout(() => {
        copyBtn.textContent = 'Copy Brief to Clipboard';
        copyBtn.classList.remove('ci-copy-btn--success');
      }, 2500);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = briefText;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('ci-copy-btn--success');
      setTimeout(() => {
        copyBtn.textContent = 'Copy Brief to Clipboard';
        copyBtn.classList.remove('ci-copy-btn--success');
      }, 2500);
    }
  });
  actions.appendChild(copyBtn);

  const downloadBtn = el('button', 'ci-signup-btn', 'Download Responses (JSON)');
  downloadBtn.addEventListener('click', () => {
    trackEvent('download_json_clicked');
    downloadJSON(state);
  });
  actions.appendChild(downloadBtn);

  section.appendChild(actions);

  const submitNote = el('p', 'ci-bridge-text',
    'Download the JSON file above and submit it with your sign-up form to be considered for the Career Intelligence Program.'
  );
  section.appendChild(submitNote);

  actions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================
// Restore from Saved State
// ============================================

function restoreFromSaved() {
  renderProgressBar();

  const form = getForm();
  let lastRenderedStage = 0;

  // Walk through conversation entries and rebuild the UI
  for (const entry of state.conversation) {
    const stageNum = typeof entry.stage === 'number' ? entry.stage : null;

    // Render new stage header when we encounter a new stage number
    if (stageNum && stageNum > lastRenderedStage) {
      // Close the previous stage
      const prev = getActiveStageEl();
      if (prev) {
        prev.classList.remove('ci-stage--active');
        prev.classList.add('ci-stage--done');
      }

      const meta = STAGES[stageNum - 1];
      const stageEl = el('div', 'ci-stage ci-stage--active');
      stageEl.dataset.stage = stageNum;
      stageEl.style.setProperty('--step-color', meta.color);

      const header = el('div', 'ci-stage-header');
      header.innerHTML = `
        <span class="ci-stage-header__icon">${ICONS[stageNum]}</span>
        <span class="ci-stage-header__num">Stage ${stageNum}</span>
        <span class="ci-stage-header__title">${meta.label}</span>
      `;
      stageEl.appendChild(header);

      // Add transition text if available
      const transKey = stageNum === 2 ? 's1_to_s2' : stageNum === 3 ? 's2_to_s3' : null;
      const transText = transKey && state.transitions[transKey];
      if (transText) {
        const trans = el('div', 'ci-transition');
        trans.innerHTML = `<p>${escapeHtml(transText)}</p>`;
        stageEl.appendChild(trans);
      }

      // Stage 1 frame text
      if (stageNum === 1) {
        const frame = el('div', 'ci-stage-frame');
        frame.innerHTML = `<p>${escapeHtml(STAGE_1_FRAME)}</p>`;
        stageEl.appendChild(frame);
      }

      // Question card
      let questionText = '';
      if (stageNum === 1) questionText = STAGE_1_QUESTION;
      else if (stageNum === 2) questionText = STAGE_2_QUESTION;
      else if (stageNum === 3 && state.selectedQ3) questionText = STAGE_3_BANK[state.selectedQ3]?.text || '';
      const qCard = el('div', 'ci-question');
      qCard.innerHTML = `<p>${escapeHtml(questionText)}</p>`;
      stageEl.appendChild(qCard);

      form.appendChild(stageEl);
      lastRenderedStage = stageNum;
    }

    const stageEl = getActiveStageEl();

    if (entry.role === 'student' && stageEl && !entry.skipped) {
      const bubble = el('div', 'ci-student-response ci-student-response--visible');
      bubble.innerHTML = `<p>${escapeHtml(entry.content)}</p>`;
      stageEl.appendChild(bubble);
    } else if (entry.role === 'ai' && entry.stage !== 'synthesis' && stageEl) {
      if (entry.reaction) {
        const bubble = el('div', 'ci-reaction ci-reaction--visible');
        let html = `<p>${escapeHtml(entry.reaction)}</p>`;
        if (entry.follow_up) {
          html += `<p class="ci-follow-up">${escapeHtml(entry.follow_up)}</p>`;
        }
        bubble.innerHTML = html;
        stageEl.appendChild(bubble);
      }
    }
  }

  // Update progress bar
  if (state.complete || state.currentStage === 'complete' || state.currentStage === 'synthesis') {
    updateProgress(4);
  } else if (typeof state.currentStage === 'number') {
    updateProgress(state.currentStage);
  }

  // Render the appropriate end state
  if (state.briefText) {
    // Mark last stage as done
    const lastStage = getActiveStageEl();
    if (lastStage) {
      lastStage.classList.remove('ci-stage--active');
      lastStage.classList.add('ci-stage--done');
    }

    // Render brief
    renderBrief(state.briefText);

    // If form was already complete, render the post-reaction section
    if (state.complete) {
      // Remove the reaction area that renderBrief added
      const reactionArea = document.querySelector('.ci-synthesis-reaction');
      if (reactionArea) reactionArea.remove();

      if (state.synthesisAdjustment) {
        renderSynthesisAdjustment(state.synthesisAdjustment);
      }
      renderPostReactionActions();
    }
  } else if (typeof state.currentStage === 'number') {
    // Still in a conversational stage — show input
    const stageEl = getActiveStageEl();
    if (stageEl) {
      appendInputArea(stageEl);
    }
  }
}

// ============================================
// Initialize
// ============================================

export function init() {
  console.log(`Career Discovery Form v${CONFIG.form_version} loaded`);

  const saved = loadSavedState();

  if (saved && !saved.complete) {
    // Show a resume prompt
    const form = getForm();
    const resumeBar = el('div', 'ci-resume-prompt');
    resumeBar.innerHTML = `
      <p>You have a session in progress. Would you like to pick up where you left off?</p>
      <div class="ci-btn-row">
        <button class="ci-submit ci-resume-btn">Resume</button>
        <button class="ci-skip ci-restart-btn">Start Fresh</button>
      </div>
    `;
    form.appendChild(resumeBar);

    resumeBar.querySelector('.ci-resume-btn').addEventListener('click', () => {
      resumeBar.remove();
      applySavedState(saved);
      restoreFromSaved();
    });

    resumeBar.querySelector('.ci-restart-btn').addEventListener('click', () => {
      resumeBar.remove();
      clearSavedState();
      renderProgressBar();
      renderStageStart(1, STAGE_1_QUESTION, null);
    });
  } else {
    if (saved && saved.complete) clearSavedState();
    renderProgressBar();
    renderStageStart(1, STAGE_1_QUESTION, null);
  }
}

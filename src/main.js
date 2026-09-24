import { missionLabel } from './labels.js';
import { createRegistration, submissionId } from './registration.js';
import { speechRates, preferredVoice, speechSegments, estimatedSeconds, timestamp } from './audio.js';
import { missions } from './missions.js';
import { evaluate, questionSections } from './scoring.js';
import { buildResult } from './results.js';
import { submitTrainingLog, REGISTRATION_ERROR, registrationData, SHEETS_WEB_APP_URL } from './sheets.js';

const app = document.querySelector('#app');
const steps = ['Mission Briefing', 'Full Audio Training', 'Listen & Repeat', 'Choose the Meaning', 'Complete the Phrase', 'Type the Sentence', 'Final Mission'];
const current = missions.find(m => m.status === 'current');
const visible = missions.filter(m => m.status === 'previous' || m === current);
let mission, state, speechRun = 0, activeRecording, speechTimer;
const registrations = createRegistration({read, write, submit: submitTrainingLog});
const manualRegistrations = new Set();
const justSubmitted = new Set();
let storageWarning = false;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const key = m => `rtc:progress:${m.id}:${m.missionVersion}`;
const resultKey = r => `${r.missionId}:${r.missionVersion}:${r.completedAt}`;
function read(name) { try { return JSON.parse(localStorage.getItem(name)); } catch { return null; } }
function write(name, value) {
  try { localStorage.setItem(name, JSON.stringify(value)); }
  catch { if (!storageWarning) { storageWarning = true; toast('Device storage is unavailable. Keep this page open and copy your result before leaving.'); } }
}
let speechPace = read('rtc:audio:pace');
if (!Object.hasOwn(speechRates, speechPace)) speechPace = 'normal';
function audioRate() { return speechRates[speechPace] * (mission?.audioRateMultiplier || 1); }
function chapterControls() {
  if (!mission.audioChapters?.length) return '';
  return '<div class="audio-chapters"><p class="small muted">Marcadores estimados para o ritmo escolhido. Cada botão inicia somente essa parte.</p>' + mission.audioChapters.map((chapter, index) => {
    const offset = mission.fallbackAudioScript.indexOf(chapter.startsAt);
    return '<button class="button secondary" data-action="audio-chapter" data-index="'+index+'">'+timestamp(estimatedSeconds(mission.fallbackAudioScript.slice(0, offset), audioRate()))+' · '+esc(chapter.title)+'</button>';
  }).join(' ') + '</div>';
}
function audioSettings() {
  return '<fieldset class="audio-settings"><legend>Ritmo da fala</legend><div class="audio-buttons">' + Object.entries({slow:'Lento',normal:'Normal',fast:'Rápido'}).map(([value,label]) => '<button type="button" class="button secondary" data-action="audio-pace" data-pace="'+value+'" aria-pressed="'+(speechPace === value)+'">'+label+'</button>').join('') + '</div><p class="small muted">Voz masculina americana quando disponível no dispositivo.</p></fieldset>';
}
function fresh() { return { step: 0, listenedFullAudio: false, repeatedOutLoud: false, difficultAudioPhrase: '', repeat: [], answers: Object.fromEntries(questionSections.map(s => [s, {}])), drafts: {}, completedAt: null, result: null }; }
function load(m) {
  const saved = read(key(m));
  if (!saved || !Number.isInteger(saved.step) || saved.step < 0 || saved.step > 7 || !saved.answers || !Array.isArray(saved.repeat) || (saved.step === 7 && (!saved.completedAt || !saved.result))) return fresh();
  return { ...fresh(), ...saved, drafts: saved.drafts || {}, answers: { ...fresh().answers, ...saved.answers } };
}
function save() { write(key(mission), state); }
function toast(message) {
  const box = document.querySelector('#toast'); box.textContent = message; box.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => box.classList.remove('visible'), 7000);
}
function stopAudio() {
  speechRun++;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (activeRecording) { activeRecording.pause(); activeRecording = null; }
  app.querySelectorAll('audio').forEach(audio => audio.pause());
}
function speak(text) {
  stopAudio();
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { toast('Audio is unavailable in this browser. Read the script or phrase out loud.'); return; }
  const run = speechRun;
  const queue = speechSegments(text);
  function next() {
    if (run !== speechRun || !queue.length) return;
    const item = queue.shift();
    if (item.pause) { speechTimer = setTimeout(next, item.pause); return; }
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = 'en-US'; utterance.rate = audioRate();
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = preferredVoice(voices);
    utterance.onend = next;
    utterance.onerror = e => { if (!['canceled', 'interrupted'].includes(e.error)) { stopAudio(); toast('Audio could not play. Use the written script or try another browser.'); } };
    window.speechSynthesis.speak(utterance);
  }
  next();
}
function playPhrase(phrase) {
  if (!phrase.audioUrl) return speak(phrase.english);
  stopAudio();
  const run = speechRun;
  const audio = new Audio(phrase.audioUrl); activeRecording = audio; audio.playbackRate = audioRate();
  let failed = false;
  const fallback = () => { if (!failed && run === speechRun) { failed = true; toast('Recording unavailable. Playing the text-to-speech version.'); speak(phrase.english); } };
  audio.onerror = fallback;
  audio.play().catch(fallback);
}
function route() {
  stopAudio(); mission = null; state = null;
  const [page, id] = location.hash.slice(1).split('/');
  if (page === 'previous') return renderPrevious();
  mission = visible.find(m => m.id === id);
  if (mission && page === 'result') {
    const result = read(`rtc:last:${mission.id}`);
    if (result) { state = { ...fresh(), result, completedAt: result.completedAt }; return renderComplete(true); }
  }
  if (mission && page === 'mission') { state = load(mission); return renderMission(); }
  mission = null; renderHome();
}
function routeArt() { return `<div class="route-art" aria-hidden="true"><span class="map-grid"></span><svg viewBox="0 0 360 260" fill="none"><path class="map-street" d="M0 62H360M0 190H360M65 0V260M285 0V260M0 130H140V260M215 0V130H360"/><path class="journey" d="M66 190H142V64H284"/><circle cx="66" cy="190" r="9" fill="currentColor"/><circle cx="284" cy="64" r="17" fill="#132537" stroke="currentColor" stroke-width="2"/><circle cx="284" cy="64" r="6" fill="currentColor"/></svg><span class="map-caption">YOUR NEXT CONVERSATION<br><strong>starts here.</strong></span></div>`; }
function missionCard(m) {
  const progress = load(m), last = read(`rtc:last:${m.id}`);
  const started = progress.step > 0 || progress.listenedFullAudio;
  const status = progress.completedAt ? 'Completed' : started ? 'In progress' : last ? 'Completed previously' : 'Not started';
  return `<article class="previous-card"><span class="week-tile">${esc(missionLabel(m.week).replace('Mission ', 'M'))}</span><div class="previous-copy"><span class="eyebrow">${m.status === 'current' ? 'CURRENT MISSION' : 'REVIEW MISSION'} · ${status}</span><h3>${esc(missionLabel(m.week))} — ${esc(m.title)}</h3><p>${esc(m.keyPhrase)}</p>${last ? `<p>Last score: ${last.totalScore} / ${last.maxScore} (${last.percentage}%) · ${esc(last.missionVersion)}</p>` : ''}<div class="card-actions"><a class="button secondary" href="#mission/${esc(m.id)}">${m.status === 'current' ? 'Open Current Mission' : 'Review Mission'} ↗</a>${last ? `<a class="button quiet" href="#result/${esc(m.id)}">Last Result</a>` : ''}</div></div></article>`;
}
function renderHome() {
  const progress = current ? load(current) : null;
  const last = visible.map(m => read(`rtc:last:${m.id}`)).filter(Boolean).sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))[0];
  app.innerHTML = `<section class="home-intro"><span class="eyebrow">WORKSPEAK / RTC LAB</span><h1>RTC Lab<br><span>Practice Missions</span></h1><p>Practice missions to help you remember useful phrases faster.</p><p class="small muted">Hi, ${esc(current?.studentName || 'there')}. Listen, practice, and say it out loud.</p></section>
    <section aria-labelledby="current-heading"><div class="section-heading"><h2 id="current-heading">Current Mission</h2><span class="pill">CURRENT</span></div>
    ${current ? `<article class="current-card"><div class="mission-card-content"><span class="eyebrow">${esc(missionLabel(current.week))} / REAL-LIFE ENGLISH</span><h3>${esc(current.title)}</h3><p class="key-phrase">${esc(current.keyPhrase)}</p><p class="muted">${esc(current.goal)}</p><div class="mission-meta"><span>◷ Go at your pace</span><span>◉ ${current.targetPhrases.length} phrases</span></div><a class="button primary" href="#mission/${esc(current.id)}">${progress.completedAt ? 'View result' : progress.step || progress.listenedFullAudio ? 'Continue mission' : 'Start Current Mission'} ↗</a><span class="saved-label">${progress.completedAt ? `Completed · ${progress.result.percentage}%` : progress.step ? `In progress · Step ${progress.step + 1} of 7` : 'Listen. Practice. Use it.'}</span></div>${routeArt()}</article>` : '<div class="panel">Your next mission is coming soon.</div>'}</section>
    <section class="home-secondary"><article class="panel"><h2>Previous Missions</h2><p class="muted">Return to earlier missions and keep your phrases fresh.</p><a class="button secondary" href="#previous">Review Previous Missions →</a></article><article class="panel"><h2>My Last Result</h2>${last ? `<p>${esc(missionLabel(last.week))} — ${esc(last.missionName)}</p><p class="last-score">${last.totalScore} / ${last.maxScore} <span class="muted">(${last.percentage}%)</span></p><p class="small muted">${esc(new Date(last.completedAt).toLocaleString())} · ${esc(last.missionVersion)}</p><a class="button secondary" href="#result/${esc(last.missionId)}">View Last Result →</a>` : '<p class="muted">Complete a mission to see your result here.</p>'}</article></section>`;
}
function renderPrevious() {
  app.innerHTML = `<a class="back-link" href="#home">← Back to Missions</a><section class="home-intro"><span class="eyebrow">KEEP YOUR ENGLISH FRESH</span><h1>Previous Missions</h1><h2>Travel Review Pack</h2><p>Use this after Cycle 2. Practice before your trip. Repeat the missions until the phrases feel automatic.</p></section><div class="previous-list">${visible.filter(m => m.status === 'previous' && !m.category).map(missionCard).join('')}${current ? missionCard(current) : ''}</div><section><div class="previous-list">${visible.filter(m => m.status === 'previous' && m.category === 'Travel Review Pack').map(missionCard).join('')}</div></section>`;
}
function renderMission() {
  if (state.completedAt && state.result) return renderComplete();
  const step = state.step;
  app.innerHTML = `<a class="back-link" href="#home">← Back to Missions</a><div class="flow-heading"><div><span class="eyebrow">${esc(missionLabel(mission.week))} / ${esc(mission.title)}</span><h1>${steps[step]}</h1></div><span class="step-count">${String(step + 1).padStart(2, '0')}<span> / 07</span></span></div><div class="step-track" aria-label="Step ${step + 1} of 7">${steps.map((s, i) => `<span class="${i <= step ? 'active' : ''}" title="${s}"></span>`).join('')}</div><section class="panel flow-panel">${stepBody(step)}</section><div class="flow-actions">${step > 0 ? '<button class="button secondary" data-action="back">← Previous step</button>' : '<span></span>'}<button class="button primary" data-action="next" ${canContinue() ? '' : 'disabled'}>${step === 6 ? 'Complete mission' : step === 0 ? 'Start Mission' : 'Continue'} →</button></div><p class="save-note">Progress saves automatically on this device.</p>`;
}
function check(id, label, checked, data = '') { return `<label class="check-row"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''} ${data}><span>${label}</span></label>`; }
function vocabulary(title, items) {
  if (!items?.length) return '';
  return `<details class="vocabulary"><summary>${title} · ${items.length} items</summary><dl>${items.map(p => `<div><dt>${esc(p.english)}</dt><dd lang="pt-BR">${esc(p.portuguese)}</dd></div>`).join('')}</dl></details>`;
}
function stepBody(step) {
  if (step === 0) return `<span class="pill">YOUR MISSION</span><h2 class="brief-title">${esc(mission.keyPhrase)}</h2><p>${esc(mission.goal)}</p><h3 class="spaced">Today you practice</h3><ul class="practice-list">${mission.todayYouPractice.map(p => `<li><span>↗</span>${esc(p)}</li>`).join('')}</ul>${vocabulary('Vocabulary', mission.vocabulary)}<div class="callout">Say the phrases out loud — this is speaking practice.<br><span class="muted">One point per correct first answer. You can retry to practice; retries do not change your score. Audio practice is tracked separately.</span></div>`;
  if (step === 1) return `<p class="lead">Listen to the full training first.</p><p class="muted">You don’t need to understand everything.<br>Listen, repeat out loud, and keep going.</p>${audioSettings()}${chapterControls()}${mission.fullAudioUrl ? `<audio controls preload="none" src="${esc(mission.fullAudioUrl)}">Your browser does not support audio.</audio><p class="small muted">If the recording does not load, use text-to-speech below.</p>` : ''}<div class="audio-buttons"><button class="button secondary" data-action="full-audio">▶ Play with text-to-speech</button><button class="button quiet" data-action="stop-audio">■ Stop audio</button></div><details><summary>Read the full audio script</summary><p class="script">${esc(mission.fallbackAudioScript)}</p></details><button class="button ${state.listenedFullAudio ? 'success-button' : 'secondary'}" data-action="listened" aria-pressed="${state.listenedFullAudio}">${state.listenedFullAudio ? '✓ ' : ''}I listened to the full audio</button>${check('repeatedOutLoud', 'I repeated out loud', state.repeatedOutLoud)}<label class="field-label" for="difficultAudioPhrase">What phrase was difficult? <span class="muted">(optional)</span></label><textarea id="difficultAudioPhrase" rows="2" maxlength="1000" placeholder="A word or phrase to practice again…">${esc(state.difficultAudioPhrase)}</textarea><p class="small muted">Confirm that you listened and repeated to continue.</p>`;
  if (step === 2) return `<p class="lead">Say it. Repeat it. Make it familiar.</p>${audioSettings()}<button class="button quiet" data-action="stop-audio">■ Stop audio</button><div class="phrase-list">${mission.targetPhrases.map((p, i) => `<article class="phrase-card"><div class="phrase-top"><span class="phrase-number">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(p.english)}</h3><p lang="pt-BR">${esc(p.portuguese)}</p></div><button class="play-button" data-action="phrase-audio" data-index="${i}" aria-label="Play audio: ${esc(p.english)}">▶<span> Play audio</span></button></div><p class="small muted">Repeat out loud 3 times</p>${check('repeat-' + i, 'I said it 3 times', state.repeat.includes(i), `data-repeat="${i}"`)}</article>`).join('')}</div>${vocabulary('Vocabulary', mission.vocabulary)}${vocabulary('Useful recognition phrases', mission.recognitionPhrases)}<p id="repeat-count" class="small muted">${state.repeat.length} / ${mission.targetPhrases.length} phrases practiced</p>`;
  const section = questionSections[step - 3];
  const instructions = { chooseMeaning: 'Read the phrase. Choose its meaning in Portuguese.', completePhrase: 'Recall the missing word. Type it below.', typeSentence: 'How would you say this in English?', finalMission: 'Your turn in a real conversation. Use a short phrase from this mission.' };
  return `${section === 'finalMission' && mission.finalMissionScenario ? `<p class="callout">${esc(mission.finalMissionScenario)}</p>` : ''}<p class="lead">${instructions[section]}</p><p class="muted">Check each answer to continue. Capitalization and punctuation don’t affect your score.${section === 'finalMission' ? ' Other valid wording may not be recognized; practice the sample phrases.' : ''}</p><div class="questions">${mission[section + 'Questions'].map((q, i) => questionCard(section, q, i)).join('')}</div>`;
}
function questionCard(section, q, i) {
  const answer = state.answers[section][i];
  const locked = answer && !answer.retrying;
  const version = q.answers?.[0] || q.options[q.answer];
  return `<article class="question-card"><span class="eyebrow">QUESTION ${String(i + 1).padStart(2, '0')}</span><h3 ${section === 'typeSentence' ? 'lang="pt-BR"' : ''}>${esc(q.prompt)}</h3>${q.hint ? `<p class="question-hint" lang="pt-BR">${esc(q.hint)}</p>` : ''}${section === 'chooseMeaning' ? `<div class="options">${q.options.map((option, j) => `<button class="option ${locked && j === q.answer ? 'correct-option' : ''} ${locked && answer.selected === j && !answer.correct ? 'wrong-option' : ''}" data-action="choose" data-index="${i}" data-option="${j}" ${locked ? 'disabled' : ''}><span>${String.fromCharCode(65 + j)}</span>${esc(option)}</button>`).join('')}</div>` : `<form data-question="${i}" data-section="${section}"><label class="sr-only" for="answer-${i}">Answer to ${esc(q.prompt)}${q.hint ? ' ' + esc(q.hint) : ''}</label><div class="answer-row"><input id="answer-${i}" name="answer" type="text" autocomplete="off" spellcheck="false" maxlength="500" placeholder="${section === 'completePhrase' ? 'Missing word…' : 'Your answer in English…'}" value="${esc(answer?.retrying ? state.drafts[section + i] || '' : answer?.value ?? state.drafts[section + i] ?? '')}" ${locked ? 'disabled' : ''} required><button class="button secondary" type="submit" ${locked ? 'disabled' : ''}>Check</button></div></form>`}${locked ? `<div class="feedback ${answer.correct ? 'positive' : 'negative'}" role="status">${answer.correct ? 'Correct ✅' : answer.verdict === 'almost' ? `Almost. Check this version: <strong>${esc(version)}</strong>` : `Try again. Correct version: <strong>${esc(version)}</strong>`}<p class="small">${answer.attempts?.length > 1 ? 'Practice retry saved. ' : ''}Your score uses your first answer.</p></div>${!answer.correct ? `<button class="button quiet retry-button" data-action="retry" data-section="${section}" data-index="${i}">Try again</button>` : ''}` : ''}</article>`;
}
function canContinue() {
  if (state.step === 0) return true;
  if (state.step === 1) return state.listenedFullAudio && state.repeatedOutLoud;
  if (state.step === 2) return mission.targetPhrases.every((_, i) => state.repeat.includes(i));
  const section = questionSections[state.step - 3];
  return mission[section + 'Questions'].every((_, i) => !!state.answers[section][i] && !state.answers[section][i].retrying);
}
function updateContinue() { const button = app.querySelector('[data-action="next"]'); if (button) button.disabled = !canContinue(); }
function finish() {
  state.result = buildResult(mission, state, navigator.userAgent);
  state.completedAt = state.result.completedAt; state.step = 7;
  save(); write(`rtc:last:${mission.id}`, state.result); renderComplete(); focusTop();
}
function renderComplete(saved = location.hash.startsWith('#result/')) {
  const r = state.result;
  console.debug('Mission complete reached', submissionId(r));
  let registrationStatus = registrations.status(r);
  if (!registrationStatus) { void sendRegistration(mission, r); registrationStatus = 'pending'; }
  const pending = registrationStatus === 'pending';
  const registered = registrationStatus === 'submitted';
  const message = pending ? 'Submitting training...' : registered ? (justSubmitted.has(r) ? 'Training submitted ✅' : 'Training already submitted ✅') : REGISTRATION_ERROR;
  const summary = r.answerSummary;
  app.innerHTML = `<a class="back-link" href="#home">← Back to Missions</a><section class="complete-header"><span class="complete-icon">✓</span><span class="eyebrow">${esc(missionLabel(r.week))} · ${esc(r.missionName)} · ${esc(r.missionVersion)}</span><h1>${saved ? 'My Last Result' : 'Mission Complete ✅'}</h1><p>${esc(new Date(r.completedAt).toLocaleString())}</p>${mission.missionCompleteMessage ? `<p class="script">${esc(mission.missionCompleteMessage)}</p><div class="phrase-chips">${mission.mainPhrases.map(p => `<span>${esc(p)}</span>`).join('')}</div>` : ''}</section><section class="panel result-panel"><div class="score-block"><div class="score-ring" style="--score:${Number(r.percentage) || 0}%"><strong>${r.percentage}<span>%</span></strong></div><div><span class="eyebrow">YOUR FINAL SCORE</span><h2>${r.totalScore} <span class="muted">/ ${r.maxScore} correct</span></h2><p class="muted">${r.listenRepeatCompleted} phrases practiced out loud</p>${r.completedItems != null ? `<p>Completed items: ${r.completedItems}</p><p class="small muted">Questions + repeated phrases + 2 audio confirmations</p>` : ''}</div></div>${summary ? `<p class="answer-summary">First answers: ${summary.correct} correct · ${summary.almost} almost · ${summary.incorrect} incorrect</p>` : ''}<div class="score-breakdown">${questionSections.map((s, i) => `<div><span>${steps[i + 3]}</span><strong>${r[s + 'Score']}${r.sectionTotals ? ' / ' + r.sectionTotals[s] : ''}</strong></div>`).join('')}</div><h3>Today you practiced</h3>${r.practicedPhrases ? `<div class="phrase-chips">${r.practicedPhrases.map(p => `<span>${esc(p)}</span>`).join('')}</div>` : '<p class="muted">See the saved result text below for phrases from this earlier version.</p>'}<h3 class="spaced">Difficult phrases</h3>${r.difficultPhrases.length ? `<ul class="difficult-list">${r.difficultPhrases.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : '<p class="muted">None reported. Keep practicing!</p>'}<div class="result-actions"><button class="button primary" data-action="copy">Copy Result ↗</button><button class="button secondary" data-action="register" ${pending || registered ? 'disabled' : ''}>${pending ? 'Submitting...' : registered ? 'Submitted ✅' : 'Try registering again'}</button>${saved ? `<a class="button quiet" href="#mission/${esc(mission.id)}">Open Mission</a>` : '<button class="button quiet" data-action="restart">Restart Mission</button>'}<a class="button quiet" href="#home">Back to Missions</a></div><p class="registration-message" role="status">${esc(message)}</p>${registered ? '<p>Your teacher can confirm it in the practice log.</p>' : ''}<button class="button quiet" data-action="manual-registration">Need manual registration?</button>${SHEETS_WEB_APP_URL.trim() && (registrationStatus === 'failed' || manualRegistrations.has(resultKey(r))) ? registrationPanel(r) : ''}<details><summary>View result text</summary><textarea class="copy-text" readonly rows="12" aria-label="Result summary">${esc(missionLabel(r.copiedResultText))}</textarea></details></section>`;
}
async function sendRegistration(submittedMission, result, retry = false) {
  const status = await registrations.send(result, retry);
  result.registrationStatus = status === 'submitted' ? 'registered' : 'error';
  result.registrationMessage = status === 'submitted' ? 'Training submitted ✅' : REGISTRATION_ERROR;
  if (status === 'submitted') justSubmitted.add(result);
  persistRegistration(submittedMission, result);
  if (state?.result && resultKey(state.result) === resultKey(result)) { state.result = result; renderComplete(); }
}
function registrationPanel(result) {
  return `<section class="callout registration-panel" aria-label="Google registration"><h3>Manual registration (optional)</h3><ol><li>Copy the registration data below.</li><li>Open the manual registration page.</li><li>Paste the data there, review your mission, and click Register Training.</li></ol><div class="card-actions"><button class="button secondary" data-action="copy-registration">Copy registration data</button><a class="button primary" href="${esc(SHEETS_WEB_APP_URL.trim())}" target="_blank" rel="noopener noreferrer">Open manual registration ↗</a></div><details><summary>Registration data — select and copy manually if needed</summary><textarea class="registration-data" readonly rows="6" aria-label="Registration data">${esc(registrationData(result))}</textarea></details><p class="small muted">The Google page confirms whether the result was saved. Then return here. Your local result stays available.</p></section>`;
}
function focusTop() { app.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
function refreshQuestion(section, i) {
  app.querySelectorAll('.question-card')[i].outerHTML = questionCard(section, mission[section + 'Questions'][i], i);
  const card = app.querySelectorAll('.question-card')[i];
  const focus = card.querySelector('.feedback') || card.querySelector('input,button');
  if (focus) { if (focus.matches('.feedback')) focus.tabIndex = -1; focus.focus({ preventScroll: true }); }
  updateContinue();
}
function record(section, i, attempt) {
  const previous = state.answers[section][i];
  if (previous && !previous.retrying) return;
  const attempts = previous ? previous.attempts || [{ value: previous.value, correct: previous.correct, verdict: previous.verdict }] : [];
  state.answers[section][i] = { ...attempt, attempts: [...attempts, attempt], retrying: false };
  save(); refreshQuestion(section, i);
}
function persistRegistration(m, result) {
  const latest = read(`rtc:last:${m.id}`);
  if (latest?.completedAt === result.completedAt) write(`rtc:last:${m.id}`, result);
  const progress = read(key(m));
  if (progress?.completedAt === result.completedAt) { progress.result = result; write(key(m), progress); }
}
app.addEventListener('input', e => {
  if (!mission) return;
  if (e.target.id === 'difficultAudioPhrase') state.difficultAudioPhrase = e.target.value;
  else if (e.target.name === 'answer') { const f = e.target.form; state.drafts[f.dataset.section + f.dataset.question] = e.target.value; }
  else return;
  save();
});
app.addEventListener('change', e => {
  if (!mission) return;
  if (e.target.id === 'repeatedOutLoud') state.repeatedOutLoud = e.target.checked;
  else if (e.target.dataset.repeat !== undefined) {
    const i = Number(e.target.dataset.repeat);
    state.repeat = state.repeat.filter(n => n !== i); if (e.target.checked) state.repeat.push(i);
    app.querySelector('#repeat-count').textContent = `${state.repeat.length} / ${mission.targetPhrases.length} phrases practiced`;
  } else return;
  save(); updateContinue();
});
app.addEventListener('submit', e => {
  const form = e.target.closest('[data-question]'); if (!form) return; e.preventDefault();
  const section = form.dataset.section, i = Number(form.dataset.question), value = form.elements.answer.value.trim();
  if (!value) { form.elements.answer.setCustomValidity('Please type your answer.'); form.elements.answer.reportValidity(); form.elements.answer.addEventListener('input', () => form.elements.answer.setCustomValidity(''), { once: true }); return; }
  const verdict = evaluate(value, mission[section + 'Questions'][i].answers);
  record(section, i, { value, correct: verdict === 'correct', verdict });
});
app.addEventListener('click', async e => {
  const button = e.target.closest('[data-action]'); if (!button || button.disabled || !mission) return;
  const action = button.dataset.action;
  if (action === 'audio-pace') {
    speechPace = button.dataset.pace;
    write('rtc:audio:pace', speechPace);
    clearTimeout(speechTimer);
    speechRun++; if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (activeRecording) activeRecording.playbackRate = audioRate();
    app.querySelectorAll('audio').forEach(audio => { audio.playbackRate = audioRate(); });
    app.querySelectorAll('[data-action="audio-pace"]').forEach(control => control.setAttribute('aria-pressed', control.dataset.pace === speechPace));
    const chapters = app.querySelector('.audio-chapters'); if (chapters) chapters.outerHTML = chapterControls();
    toast('Ritmo atualizado. Toque em Play para ouvir a voz gerada neste ritmo.');
  }
  if (action === 'audio-chapter') {
    const index = Number(button.dataset.index), chapters = mission.audioChapters;
    const start = mission.fallbackAudioScript.indexOf(chapters[index].startsAt);
    const end = chapters[index + 1] ? mission.fallbackAudioScript.indexOf(chapters[index + 1].startsAt) : undefined;
    speak(mission.fallbackAudioScript.slice(start, end));
  }
  if (action === 'full-audio') speak(mission.fallbackAudioScript);
  if (action === 'stop-audio') stopAudio();
  if (action === 'phrase-audio') playPhrase(mission.targetPhrases[Number(button.dataset.index)]);
  if (action === 'listened') { state.listenedFullAudio = !state.listenedFullAudio; save(); button.setAttribute('aria-pressed', state.listenedFullAudio); button.classList.toggle('success-button', state.listenedFullAudio); button.textContent = `${state.listenedFullAudio ? '✓ ' : ''}I listened to the full audio`; updateContinue(); }
  if (action === 'choose') {
    const i = Number(button.dataset.index), selected = Number(button.dataset.option), q = mission.chooseMeaningQuestions[i];
    record('chooseMeaning', i, { selected, value: q.options[selected], correct: selected === q.answer, verdict: selected === q.answer ? 'correct' : 'incorrect' });
  }
  if (action === 'retry') {
    const section = button.dataset.section, i = Number(button.dataset.index);
    state.answers[section][i].retrying = true; state.drafts[section + i] = ''; save(); refreshQuestion(section, i);
  }
  if (action === 'next' && canContinue()) { stopAudio(); if (state.step === 6) finish(); else { state.step++; save(); renderMission(); focusTop(); } }
  if (action === 'back') { stopAudio(); state.step = Math.max(0, state.step - 1); save(); renderMission(); focusTop(); }
  if (action === 'restart') { stopAudio(); state = fresh(); save(); renderMission(); focusTop(); }
  if (action === 'copy') {
    try { await navigator.clipboard.writeText(missionLabel(state.result.copiedResultText)); toast('Result copied. Paste it into WhatsApp for your teacher.'); }
    catch { const field = app.querySelector('.copy-text'); if (field) { field.closest('details').open = true; field.focus(); field.select(); } toast('Select and copy the result text below.'); }
  }
  if (action === 'copy-registration') {
    try { await navigator.clipboard.writeText(registrationData(state.result)); toast('Registration data copied. Paste it on the Google registration page.'); }
    catch { const field = app.querySelector('.registration-data'); if (field) { field.closest('details').open = true; field.focus(); field.select(); } toast('Select and copy the registration data below.'); }
  }
  if (action === 'manual-registration') { manualRegistrations.add(resultKey(state.result)); renderComplete(); }
  if (action === 'register') {
    const task = sendRegistration(mission, state.result, true);
    renderComplete(); await task;
  }
});
app.addEventListener('play', e => {
  if (e.target.tagName !== 'AUDIO') return;
  e.target.playbackRate = audioRate();
  speechRun++; if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (activeRecording) { activeRecording.pause(); activeRecording = null; }
}, true);
window.addEventListener('hashchange', () => { route(); focusTop(); });
window.addEventListener('pagehide', stopAudio);
route();

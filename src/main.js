import { phases, shuffledIndices, starText, completionFeedback, addReward, rewardSummary } from './practice.js';
import { missionLabel } from './labels.js';
import { createRegistration, submissionId } from './registration.js';
import { speechRates, preferredVoice, speechSegments, estimatedSeconds, timestamp } from './audio.js';
import { missions } from './missions.js';
import { evaluate, questionSections, acceptedAnswers, normalize, reviewItems, uniquePhrases } from './scoring.js';
import { buildResult } from './results.js';
import { submitTrainingLog, REGISTRATION_ERROR, registrationData, SHEETS_WEB_APP_URL } from './sheets.js';

const app = document.querySelector('#app');
const steps = ['Mission Briefing', 'Full Audio Training', 'Listen & Repeat', 'Choose the Meaning', 'Complete the Phrase', 'Type the Sentence', 'Final Mission'];
const current = missions.find(m => m.status === 'current');
const nextMission = missions.find(m => m.status === 'draft' && m.isNext);
const visible = missions.filter(m => m.status === 'previous' || m === current);
let mission, state, speechRun = 0, activeRecording, speechTimer;
const registrations = createRegistration({read, write, submit: submitTrainingLog});
const manualRegistrations = new Set();
const justSubmitted = new Set();
let storageWarning = false;
let review = null;
let speechPaused = false, resumeSpeech = null;
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
function audioSections() {
  return (mission.audioSections || mission.audioChapters || []).filter(chapter => typeof chapter.startsAt === 'string' && chapter.startsAt.length && mission.fallbackAudioScript.includes(chapter.startsAt));
}
function chapterControls() {
  if (!audioSections().length) return '';
  return '<div class="audio-chapters"><p class="small muted">Marcadores estimados para o ritmo escolhido. Cada botão inicia somente essa parte.</p>' + audioSections().map((chapter, index) => {
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
  // Completed attempts remain in Last Result; opening the mission starts a new practice.
  if (saved?.completedAt && saved.result) return fresh();
  if (!saved || !Number.isInteger(saved.step) || saved.step < 0 || saved.step > 7 || !saved.answers || !Array.isArray(saved.repeat) || (saved.step === 7 && (!saved.completedAt || !saved.result))) return fresh();
  return { ...fresh(), ...saved, drafts: saved.drafts || {}, answers: { ...fresh().answers, ...saved.answers } };
}
function save() { if (!review) write(key(mission), state); }
function toast(message) {
  const box = document.querySelector('#toast'); box.textContent = message; box.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => box.classList.remove('visible'), 7000);
}
function stopAudio() {
  speechPaused = false; resumeSpeech = null; clearTimeout(speechTimer);
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
    if (speechPaused) { resumeSpeech = next; return; }
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
  stopAudio(); mission = null; state = null; review = null;
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
  return `<article class="previous-card"><span class="week-tile">${esc(missionLabel(m.week).replace('Mission ', 'M'))}</span><div class="previous-copy"><span class="eyebrow">${m.status === 'current' ? 'CURRENT MISSION' : 'REVIEW MISSION'} · ${status}</span><h3>${esc(missionLabel(m.week))} — ${esc(m.title)}</h3><p>${esc(m.keyPhrase)}</p>${last ? `<p class="stars">${starText(last.percentage)}</p><p>Last score: ${last.totalScore} / ${last.maxScore} (${last.percentage}%) · ${esc(last.missionVersion)}</p>` : ''}<div class="card-actions"><a class="button secondary" href="#mission/${esc(m.id)}">${m.status === 'current' ? 'Open Current Mission' : 'Review Mission'} →</a>${last ? `<a class="button quiet" href="#result/${esc(m.id)}">Last Result</a>` : ''}</div></div></article>`;
}
function effort(m) {
  const minutes = Math.ceil(estimatedSeconds(m.fallbackAudioScript, speechRates.normal * (m.audioRateMultiplier || 1)) / 60 + m.targetPhrases.length / 10 + questionSections.reduce((n, section) => n + m[section + 'Questions'].length, 0) / 5);
  return `About ${minutes}–${minutes + 5} min with full audio`;
}
function renderHome() {
  const progress = current ? load(current) : null;
  const rewards = rewardSummary(read('rtc:rewards:v1') || {});
  const last = visible.map(m => read(`rtc:last:${m.id}`)).filter(Boolean).sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))[0];
  app.innerHTML = `<section class="home-intro compact-intro"><p>Hi, ${esc(current?.studentName || 'there')}. Ready for your next conversation?</p><p class="small muted">${rewards.xp} XP · ${rewards.completed} missions completed</p></section>
    <section aria-labelledby="current-heading"><div class="section-heading"><h1 id="current-heading" class="home-mission-heading">TODAY'S MISSION</h1></div>
    ${current ? `<article class="current-card"><div class="mission-card-content"><span class="eyebrow">${esc(missionLabel(current.week))}</span><h3>${esc(current.title)}</h3><p class="key-phrase">${esc(current.keyPhrase)}</p><p class="small muted">${effort(current)} · ★★★ available</p><a class="button primary" href="#mission/${esc(current.id)}">${progress.step || progress.listenedFullAudio ? 'CONTINUE MISSION' : 'START MISSION'} →</a><span class="saved-label">${progress.step ? `In progress · Phase ${phases[progress.step].number} of 5` : 'Listen. Practice. Use it.'}</span></div>${routeArt()}</article>` : '<div class="panel">Your next mission is coming soon.</div>'}</section>
    ${nextMission ? `<section aria-labelledby="next-heading"><div class="section-heading"><h2 id="next-heading">Next Mission</h2><span class="pill">COMING NEXT</span></div><article class="panel"><span class="eyebrow">${esc(missionLabel(nextMission.week))}</span><h3>${esc(nextMission.title)}</h3><p>${esc(nextMission.keyPhrase)}</p></article></section>` : ''}
    <section class="home-secondary"><article class="panel"><h2>Previous Missions</h2><p class="muted">Return to earlier missions and keep your phrases fresh.</p><a class="button secondary" href="#previous">Review Previous Missions →</a></article><article class="panel"><h2>My Last Result</h2>${last ? `<p>${esc(missionLabel(last.week))} — ${esc(last.missionName)}</p><p class="last-score">${last.totalScore} / ${last.maxScore} <span class="muted">(${last.percentage}%)</span></p><p class="small muted">${esc(new Date(last.completedAt).toLocaleString())} · ${esc(last.missionVersion)}</p><a class="button secondary" href="#result/${esc(last.missionId)}">View Last Result →</a>` : '<p class="small muted">FIRST RESULT LOCKED 🔒<br>Complete one mission to unlock your result.</p>'}</article></section>`;
}
function renderPrevious() {
  const previous = visible.filter(m => m.status === 'previous').sort((a, b) =>
    Number(a.week.match(/\d+/)?.[0] || 0) - Number(b.week.match(/\d+/)?.[0] || 0));
  app.innerHTML = `<a class="back-link" href="#home">← Back to Missions</a><section class="home-intro"><span class="eyebrow">KEEP YOUR ENGLISH FRESH</span><h1>Previous Missions</h1><h2>Travel Review Pack</h2><p>Use this after Cycle 2. Practice before your trip. Repeat the missions until the phrases feel automatic.</p></section><div class="previous-list">${previous.map(missionCard).join('')}</div>`;
}

function sectionNow() { return review ? review.items[review.cursor]?.section : questionSections[state.step - 3]; }
function indexNow() {
  if (review) return review.items[review.cursor]?.index;
  const section = sectionNow(); state.cursors ||= {};
  if (state.cursors[section] == null) {
    const first = mission[section + 'Questions'].findIndex((_, i) => !state.answers[section][i] || state.answers[section][i].retrying);
    state.cursors[section] = first < 0 ? mission[section + 'Questions'].length - 1 : first;
  }
  return state.cursors[section];
}
function answerFor(section, i) { return (review ? review.answers : state.answers)[section]?.[i]; }
function orderFor(section, i, count) {
  const owner = review || state; owner.orders ||= {};
  const id = section + i;
  if (!owner.orders[id] || owner.orders[id].length !== count) { owner.orders[id] = shuffledIndices(count); save(); }
  return owner.orders[id];
}
function phraseIndex() {
  if (state.phraseCursor == null) {
    const first = mission.targetPhrases.findIndex((_, i) => !state.repeat.includes(i)); state.phraseCursor = first < 0 ? 0 : first;
  }
  return Math.min(state.phraseCursor, mission.targetPhrases.length - 1);
}
function primaryAction() {
  if (review || state.step >= 3) {
    const section = sectionNow(), i = indexNow(), q = mission[section + 'Questions'][i], answer = answerFor(section, i);
    if (!answer || answer.retrying) {
      if (section === 'chooseMeaning' || (q.wordBank?.length && !(review || state).hardModes?.[section + i])) return '<span class="small muted">Choose an answer above</span>';
      return `<button class="button primary" type="submit" form="answer-form">${section === 'finalMission' ? 'Check response' : 'Check'}</button>`;
    }
    const last = review ? review.cursor === review.items.length - 1 : i === mission[section + 'Questions'].length - 1;
    return `<button class="button primary" data-action="advance-item">${last ? review ? 'Finish review' : state.step === 6 ? 'Complete Mission' : 'Continue' : 'Next'} →</button>`;
  }
  if (state.step === 2) return `<button class="button primary" data-action="said">${state.repeat.includes(phraseIndex()) ? 'Next phrase' : 'I SAID IT'} →</button>`;
  return `<button class="button primary" data-action="next" ${canContinue() ? '' : 'disabled'}>${state.step === 0 ? 'START MISSION' : 'Continue'} →</button>`;
}
function renderMission() {
  if (!review && state.completedAt && state.result) return renderComplete();
  const step = state.step, phase = review ? { number: 5, name: 'Train What I Missed', part: 'Practice only · original score stays saved' } : phases[step];
  app.innerHTML = `<a class="back-link" href="#home">← Back to Missions</a><div class="flow-heading"><div><span class="eyebrow">${esc(missionLabel(mission.week))} · ${esc(mission.title)}</span><h1>${phase.name}</h1><p class="small muted">${phase.part}</p></div><span class="step-count">${String(phase.number).padStart(2, '0')}<span> / 05</span></span></div><progress class="mission-progress" max="5" value="${phase.number}" aria-label="Phase ${phase.number} of 5"></progress><section class="panel flow-panel ${!review && step === 6 ? 'final-round' : ''}">${review ? questionCard(sectionNow(), mission[sectionNow() + 'Questions'][indexNow()], indexNow()) : stepBody(step)}</section><div class="flow-actions">${review ? '<button class="button quiet" data-action="exit-review">Back to result</button>' : step > 0 ? '<button class="button quiet" data-action="back">← Back</button>' : '<span></span>'}${primaryAction()}</div><p class="save-note">${review ? 'Review never changes your original score.' : 'Progress saves on this device. First answers count toward your score.'}</p>`;
}
function check(id, label, checked, data = '') { return `<label class="check-row"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''} ${data}><span>${label}</span></label>`; }
function vocabulary(title, items) {
  if (!items?.length) return '';
  return `<details class="vocabulary"><summary>${title} · ${items.length} items</summary><dl>${items.map(p => `<div><dt>${esc(p.english)}</dt><dd lang="pt-BR">${esc(p.portuguese)}</dd></div>`).join('')}</dl></details>`;
}
function stepBody(step) {
  if (step === 0) return `<h2 class="brief-title">${esc(mission.keyPhrase)}</h2><p>${esc(mission.goal.length > 180 ? `Practice ${mission.shortTitle.toLowerCase()} in real travel situations. Ask for what you need.` : mission.goal)}</p><p class="mission-meta">${effort(mission)}</p><p class="stars">Up to ★★★ + ${90 + questionSections.reduce((n, section) => n + mission[section + 'Questions'].length * 5, 0)} XP</p><details><summary>What you will practice</summary>${mission.goal.length > 180 ? `<p>${esc(mission.goal)}</p>` : ''}<ul class="practice-list">${mission.todayYouPractice.map(p => `<li>${esc(p)}</li>`).join('')}</ul></details>${vocabulary('Vocabulary', mission.vocabulary)}`;
  if (step === 1) return `<p class="lead">Listen to the full training first.</p><p class="muted">You don’t need to understand everything.<br>Listen, repeat out loud, and keep going.</p>${audioSettings()}${chapterControls()}${mission.fullAudioUrl ? `<audio controls preload="none" src="${esc(mission.fullAudioUrl)}">Your browser does not support audio.</audio><p class="small muted">If the recording does not load, use text-to-speech below.</p>` : ''}<div class="audio-buttons"><button class="button secondary" data-action="full-audio">▶ Play / Restart voice</button><button class="button quiet" data-action="pause-audio">Pause</button><button class="button quiet" data-action="stop-audio">■ Stop audio</button></div><details><summary>Read the full audio script</summary><p class="script">${esc(mission.fallbackAudioScript)}</p></details><button class="button ${state.listenedFullAudio ? 'success-button' : 'secondary'}" data-action="listened" aria-pressed="${state.listenedFullAudio}">${state.listenedFullAudio ? '✓ ' : ''}I listened to the full audio</button>${check('repeatedOutLoud', 'I repeated (out loud, quietly or in my head)', state.repeatedOutLoud)}<label class="field-label" for="difficultAudioPhrase">What phrase was difficult? <span class="muted">(optional)</span></label><textarea id="difficultAudioPhrase" rows="2" maxlength="1000" placeholder="A word or phrase to practice again…">${esc(state.difficultAudioPhrase)}</textarea><p class="small muted">Confirm that you listened and repeated to continue.</p>`;
  if (step === 2) {
    const i = phraseIndex(), p = mission.targetPhrases[i];
    return `<p class="eyebrow">${i + 1} / ${mission.targetPhrases.length} phrases</p><article class="phrase-card"><h2>${esc(p.english)}</h2><button class="button secondary" data-action="phrase-audio" data-index="${i}">▶ Play phrase</button><details><summary>Show meaning</summary><p lang="pt-BR">${esc(p.portuguese)}</p></details>${state.repeat.includes(i) ? '<p class="positive">✓ Practiced</p>' : '<p>Listen. Repeat. Say it.</p>'}</article><p class="small muted">Can't speak out loud? Say it quietly or practice in your head.</p><p class="small muted">${state.repeat.length} / ${mission.targetPhrases.length} practiced</p>${i > 0 ? '<button class="button quiet" data-action="previous-phrase">← Previous phrase</button>' : ''}${vocabulary('Vocabulary', mission.vocabulary)}${vocabulary('Useful recognition phrases', mission.recognitionPhrases)}`;
  }
  const section = sectionNow(), i = indexNow();
  return `${section === 'finalMission' && mission.finalMissionScenario ? `<details><summary>Travel situation</summary><p>${esc(mission.finalMissionScenario)}</p></details>` : ''}${questionCard(section, mission[section + 'Questions'][i], i)}`;
}
function questionCard(section, q, i) {
  const answer = answerFor(section, i), locked = answer && !answer.retrying;
  const version = acceptedAnswers(q)[0] || q.options?.[q.answer];
  const bank = section === 'completePhrase' && q.wordBank?.length && !(review || state).hardModes?.[section + i];
  const progress = review ? `${review.cursor + 1} / ${review.items.length}` : `${i + 1} / ${mission[section + 'Questions'].length}`;
  const options = section === 'chooseMeaning' ? q.options : bank ? q.wordBank : null;
  const draft = (review || state).drafts?.[section + i] || '';
  return `<article class="question-card" data-item="${i}"><span class="eyebrow">${section === 'finalMission' ? 'FINAL MISSION' : review ? 'REVIEW' : steps[questionSections.indexOf(section) + 3]} · ${progress}</span><h3 ${section === 'typeSentence' ? 'lang="pt-BR"' : ''}>${esc(q.prompt)}</h3>${q.hint ? `<p class="question-hint" lang="pt-BR">${esc(q.hint)}</p>` : ''}${options ? `<div class="options">${orderFor(section, i, options.length).map((j, position) => `<button class="option ${locked && (bank ? evaluate(options[j], q) === 'correct' : j === q.answer) ? 'correct-option' : ''} ${locked && answer.value === options[j] && !answer.correct ? 'wrong-option' : ''}" data-action="${bank ? 'bank' : 'choose'}" data-section="${section}" data-index="${i}" data-option="${j}" ${locked ? 'disabled' : ''}><span>${String.fromCharCode(65 + position)}</span>${esc(options[j])}</button>`).join('')}</div>${bank && !answer ? `<button class="button quiet" data-action="hard-mode" data-section="${section}" data-index="${i}">Hard mode · Type it</button>` : ''}` : `<form id="answer-form" data-question="${i}" data-section="${section}"><label class="sr-only" for="answer-${i}">Answer to ${esc(q.prompt)}</label><input id="answer-${i}" name="answer" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="${section === 'completePhrase' ? 60 : 240}" minlength="${section === 'completePhrase' ? 1 : 3}" placeholder="${section === 'completePhrase' ? 'Missing word…' : 'Your answer in English…'}" value="${esc(answer?.retrying ? draft : answer?.value ?? draft)}" ${locked ? 'disabled' : ''} required></form>`}${locked ? `<div class="feedback ${answer.correct ? 'positive' : 'negative'}" role="status">${answer.correct ? 'Correct ✓' : section === 'chooseMeaning' ? `Not this one. Correct: <strong>${esc(version)}</strong>` : `Correct version: <strong>${esc(version)}</strong>`}<p class="small">${review ? 'Review practice. Original score unchanged.' : 'Your first answer determines the score.'}</p></div>${!answer.correct ? `<button class="button quiet retry-button" data-action="retry" data-section="${section}" data-index="${i}">Practice Again</button>` : ''}<button class="button quiet" data-action="correct-audio" data-section="${section}" data-index="${i}">▶ Play correct phrase</button>` : ''}</article>`;
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
  write(`rtc:last:${mission.id}`, state.result);
  write('rtc:rewards:v1', addReward(read('rtc:rewards:v1') || {}, state.result));
  write(key(mission), fresh());
  renderComplete(); focusTop();
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
  const missed = r.missionVersion === mission.missionVersion ? reviewItems(mission, r.wrongAnswers) : [];
  const difficult = uniquePhrases(r.missionVersion === mission.missionVersion && Array.isArray(r.wrongAnswers) ? missed.map(item => item.phrase) : r.difficultPhrases || []).slice(0, 6);
  const rewards = read('rtc:rewards:v1') || {};
  const reward = rewards[JSON.stringify([r.missionId, r.missionVersion, r.completedAt])];
  app.innerHTML = `<a class="back-link" href="#home">← Back to Missions</a><section class="complete-header"><span class="complete-icon">✓</span><span class="eyebrow">${esc(missionLabel(r.week))} · ${esc(r.missionName)} · ${esc(r.missionVersion)}</span><h1>${saved ? 'My Last Result' : 'Mission Complete ✅'}</h1><p>${esc(completionFeedback(r.percentage))}</p><p class="stars">${starText(r.percentage)}${reward ? ` · ${reward.xp} XP earned` : ''}</p><p>${esc(new Date(r.completedAt).toLocaleString())}</p>${mission.missionCompleteMessage ? `<details><summary>Mission reminders</summary><p class="script">${esc(mission.missionCompleteMessage)}</p><div class="phrase-chips">${(mission.mainPhrases || []).map(p => `<span>${esc(p)}</span>`).join('')}</div></details>` : ''}</section><section class="panel result-panel"><div class="score-block"><div class="score-ring" style="--score:${Number(r.percentage) || 0}%"><strong>${r.percentage}<span>%</span></strong></div><div><span class="eyebrow">YOUR FINAL SCORE</span><h2>${r.totalScore} <span class="muted">/ ${r.maxScore} correct</span></h2><p class="muted">${r.listenRepeatCompleted} phrases practiced</p>${r.completedItems != null ? `<p>Completed items: ${r.completedItems}</p><p class="small muted">Questions + repeated phrases + 2 audio confirmations</p>` : ''}</div></div>${summary ? `<p class="answer-summary">First answers: ${summary.correct} correct · ${summary.almost} almost · ${summary.incorrect} incorrect</p>` : ''}<div class="score-breakdown">${questionSections.map((s, i) => `<div><span>${steps[i + 3]}</span><strong>${r[s + 'Score']}${r.sectionTotals ? ' / ' + r.sectionTotals[s] : ''}</strong></div>`).join('')}</div><h3>Today you practiced</h3>${r.practicedPhrases ? `<div class="phrase-chips">${r.practicedPhrases.map(p => `<span>${esc(p)}</span>`).join('')}</div>` : '<p class="muted">See the saved result text below for phrases from this earlier version.</p>'}<h3 class="spaced">Difficult phrases</h3>${difficult.length ? `<ul class="difficult-list">${difficult.map(p => `<li>${esc(p)}</li>`).join('')}</ul>${missed.length > 6 ? `<p class="small muted">Start with these 6. Train What I Missed covers all ${missed.length} unique phrases.</p>` : ''}` : '<p class="muted">None reported. Keep practicing!</p>'}${r.difficultAudioPhrase ? `<p class="small muted">Audio phrase you noted: ${esc(r.difficultAudioPhrase)}</p>` : ''}<div class="result-actions">${missed.length ? '<button class="button primary" data-action="review-missed">TRAIN WHAT I MISSED</button>' : ''}<button class="button primary" data-action="copy">Copy Result</button><button class="button secondary" data-action="register" ${pending || registered ? 'disabled' : ''}>${pending ? 'Submitting...' : registered ? 'Submitted ✅' : 'Try registering again'}</button>${saved ? `<a class="button quiet" href="#mission/${esc(mission.id)}">Restart Mission</a>` : '<button class="button quiet" data-action="restart">Restart Mission</button>'}<a class="button quiet" href="#home">Back to Missions</a></div><p class="registration-message" role="status">${esc(message)}</p>${registered ? '<p>Your teacher can confirm it in the practice log.</p>' : ''}<button class="button quiet" data-action="manual-registration">Need manual registration?</button>${SHEETS_WEB_APP_URL.trim() && (registrationStatus === 'failed' || manualRegistrations.has(resultKey(r))) ? registrationPanel(r) : ''}<details><summary>View result text</summary><textarea class="copy-text" readonly rows="12" aria-label="Result summary">${esc(missionLabel(r.copiedResultText))}</textarea></details></section>`;
}
async function sendRegistration(submittedMission, result, retry = false) {
  const status = await registrations.send(result, retry);
  result.registrationStatus = status === 'submitted' ? 'registered' : 'error';
  result.registrationMessage = status === 'submitted' ? 'Training submitted ✅' : REGISTRATION_ERROR;
  if (status === 'submitted') justSubmitted.add(result);
  persistRegistration(submittedMission, result);
  if (!review && state?.result && resultKey(state.result) === resultKey(result)) { state.result = result; renderComplete(); }
}
function registrationPanel(result) {
  return `<section class="callout registration-panel" aria-label="Google registration"><h3>Manual registration (optional)</h3><ol><li>Copy the registration data below.</li><li>Open the manual registration page.</li><li>Paste the data there, review your mission, and click Register Training.</li></ol><div class="card-actions"><button class="button secondary" data-action="copy-registration">Copy registration data</button><a class="button primary" href="${esc(SHEETS_WEB_APP_URL.trim())}" target="_blank" rel="noopener noreferrer">Open manual registration →</a></div><details><summary>Registration data — select and copy manually if needed</summary><textarea class="registration-data" readonly rows="6" aria-label="Registration data">${esc(registrationData(result))}</textarea></details><p class="small muted">The Google page confirms whether the result was saved. Then return here. Your local result stays available.</p></section>`;
}
function focusTop() { app.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
function refreshQuestion() {
  renderMission();
  const focus = app.querySelector('.feedback') || app.querySelector('input');
  if (focus) { focus.tabIndex = -1; focus.focus({ preventScroll: true }); }
}
function record(section, i, attempt) {
  const target = review ? review.answers : state.answers; target[section] ||= {};
  const previous = target[section][i];
  if (previous && !previous.retrying) return;
  const attempts = previous ? previous.attempts || [{ value: previous.value, correct: previous.correct, verdict: previous.verdict }] : [];
  target[section][i] = { ...attempt, attempts: [...attempts, attempt], retrying: false };
  save(); refreshQuestion();
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
  else if (e.target.name === 'answer') { const f = e.target.form; (review || state).drafts[f.dataset.section + f.dataset.question] = e.target.value; }
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
  if (!value || (section !== 'completePhrase' && normalize(value).replace(/[^a-z]/g, '').length < 3)) { form.elements.answer.setCustomValidity('Please type a word or short sentence.'); form.elements.answer.reportValidity(); form.elements.answer.addEventListener('input', () => form.elements.answer.setCustomValidity(''), { once: true }); return; }
  const verdict = evaluate(value, mission[section + 'Questions'][i]);
  record(section, i, { value, correct: verdict === 'correct', verdict });
});
app.addEventListener('click', async e => {
  const button = e.target.closest('[data-action]'); if (!button || button.disabled || !mission) return;
  const action = button.dataset.action;
  if (action === 'audio-pace') {
    speechPace = button.dataset.pace;
    write('rtc:audio:pace', speechPace);
    speechPaused = false; resumeSpeech = null;
    const pause = app.querySelector('[data-action="pause-audio"]'); if (pause) pause.textContent = 'Pause';
    clearTimeout(speechTimer);
    speechRun++; if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (activeRecording) activeRecording.playbackRate = audioRate();
    app.querySelectorAll('audio').forEach(audio => { audio.playbackRate = audioRate(); });
    app.querySelectorAll('[data-action="audio-pace"]').forEach(control => control.setAttribute('aria-pressed', control.dataset.pace === speechPace));
    const chapters = app.querySelector('.audio-chapters'); if (chapters) chapters.outerHTML = chapterControls();
    toast('Ritmo atualizado. Toque em Play para ouvir a voz gerada neste ritmo.');
  }
  if (action === 'audio-chapter') {
    const pause = app.querySelector('[data-action="pause-audio"]'); if (pause) pause.textContent = 'Pause';
    const index = Number(button.dataset.index), chapters = audioSections();
    const start = mission.fallbackAudioScript.indexOf(chapters[index].startsAt);
    const end = chapters[index + 1] ? mission.fallbackAudioScript.indexOf(chapters[index + 1].startsAt) : undefined;
    speak(mission.fallbackAudioScript.slice(start, end));
  }
  if (action === 'full-audio') { speak(mission.fallbackAudioScript); app.querySelector('[data-action="pause-audio"]').textContent = 'Pause'; }
  if (action === 'pause-audio') {
    if (!('speechSynthesis' in window)) return;
    speechPaused = !speechPaused;
    if (speechPaused) window.speechSynthesis.pause();
    else { window.speechSynthesis.resume(); const next = resumeSpeech; resumeSpeech = null; next?.(); }
    button.textContent = speechPaused ? 'Resume' : 'Pause';
  }
  if (action === 'stop-audio') { stopAudio(); const pause = app.querySelector('[data-action="pause-audio"]'); if (pause) pause.textContent = 'Pause'; }

  if (action === 'phrase-audio') playPhrase(mission.targetPhrases[Number(button.dataset.index)]);
  if (action === 'listened') { state.listenedFullAudio = !state.listenedFullAudio; save(); button.setAttribute('aria-pressed', state.listenedFullAudio); button.classList.toggle('success-button', state.listenedFullAudio); button.textContent = `${state.listenedFullAudio ? '✓ ' : ''}I listened to the full audio`; updateContinue(); }
  if (action === 'choose') {
    const i = Number(button.dataset.index), selected = Number(button.dataset.option), q = mission.chooseMeaningQuestions[i];
    record('chooseMeaning', i, { selected, value: q.options[selected], correct: selected === q.answer, verdict: selected === q.answer ? 'correct' : 'incorrect' });
  }
  if (action === 'retry') {
    const section = button.dataset.section, i = Number(button.dataset.index);
    (review ? review.answers : state.answers)[section][i].retrying = true; (review || state).drafts[section + i] = ''; save(); refreshQuestion(section, i);
  }
  if (action === 'hard-mode') {
    const owner = review || state; owner.hardModes ||= {}; owner.hardModes[button.dataset.section + button.dataset.index] = true; save(); renderMission();
  }
  if (action === 'bank') {
    const section = button.dataset.section, i = Number(button.dataset.index), q = mission[section + 'Questions'][i], value = q.wordBank[Number(button.dataset.option)];
    const verdict = evaluate(value, q); record(section, i, { value, correct: verdict === 'correct', verdict });
  }
  if (action === 'correct-audio') {
    const q = mission[button.dataset.section + 'Questions'][Number(button.dataset.index)];
    speak(button.dataset.section === 'chooseMeaning' ? q.practicePhrase || q.prompt : q.fullPhrase || acceptedAnswers(q)[0]);
  }
  if (action === 'previous-phrase') { stopAudio(); state.phraseCursor = Math.max(0, phraseIndex() - 1); save(); renderMission(); focusTop(); }
  if (action === 'said') {
    stopAudio(); const i = phraseIndex(); if (!state.repeat.includes(i)) state.repeat.push(i);
    if (i < mission.targetPhrases.length - 1) state.phraseCursor = i + 1;
    else if (canContinue()) state.step++;
    else state.phraseCursor = mission.targetPhrases.findIndex((_, i) => !state.repeat.includes(i));
    save(); renderMission(); focusTop();
  }
  if (action === 'advance-item') {
    stopAudio(); const section = sectionNow(), i = indexNow(), answer = answerFor(section, i);
    if (!answer || answer.retrying) return;
    if (review) { if (++review.cursor >= review.items.length) { review = null; renderComplete(); toast('Review complete. Your original result is unchanged.'); } else renderMission(); }
    else if (i < mission[section + 'Questions'].length - 1) { state.cursors[section]++; save(); renderMission(); }
    else if (canContinue()) { if (state.step === 6) finish(); else { state.step++; save(); renderMission(); } }
    focusTop();
  }
  if (action === 'review-missed') {
    const items = reviewItems(mission, state.result.wrongAnswers);
    if (!items.length) return;
    review = { items, cursor: 0, answers: {}, drafts: {} }; renderMission(); focusTop();
  }
  if (action === 'exit-review') { review = null; renderComplete(); focusTop(); }
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

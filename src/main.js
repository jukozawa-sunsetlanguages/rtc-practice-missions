import { missions } from './missions.js';
import { evaluate, questionSections, summarize } from './scoring.js';
import { registerTraining } from './sheets.js';

const app = document.querySelector('#app');
const steps = ['Mission Briefing', 'Full Audio Training', 'Listen & Repeat', 'Choose the Meaning', 'Complete the Phrase', 'Type the Sentence', 'Final Mission'];
const visible = missions.filter(m => m.status === 'previous' || m === missions.find(m => m.status === 'current'));
let mission, state, speechQueue = [], speechRun = 0, registering = false;
let storageWarning = false;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const key = m => `rtc:progress:${m.id}:${m.missionVersion}`;
function read(keyName) { try { return JSON.parse(localStorage.getItem(keyName)); } catch { return null; } }
function write(keyName, value) {
  try { localStorage.setItem(keyName, JSON.stringify(value)); }
  catch { if (!storageWarning) { storageWarning = true; toast('Device storage is unavailable. Keep this page open and copy your result before leaving.'); } }
}
function fresh() { return { step: 0, listenedFullAudio: false, repeatedOutLoud: false, difficultAudioPhrase: '', repeat: [], answers: Object.fromEntries(questionSections.map(s => [s, {}])), drafts: {}, completedAt: null, result: null }; }
function load(m) {
  const saved = read(key(m));
  if (!saved || !Number.isInteger(saved.step) || saved.step < 0 || saved.step > 7 || !saved.answers || !Array.isArray(saved.repeat) || (saved.step === 7 && (!saved.completedAt || !saved.result))) return fresh();
  return { ...fresh(), ...saved, drafts: saved.drafts || {}, answers: { ...fresh().answers, ...saved.answers } };
}
function save() { write(key(mission), state); }
function toast(message) { const box = document.querySelector('#toast'); box.textContent = message; box.classList.add('visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => box.classList.remove('visible'), 7000); }
function stopSpeech() { speechRun++; speechQueue = []; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
function speak(text) {
  stopSpeech();
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { toast('Audio is unavailable in this browser. Read the script below out loud.'); return; }
  const run = speechRun;
  speechQueue = text.match(/[^.!?]+[.!?]*/g)?.map(t => t.replace(/\.{2,}/g, '').trim()).filter(Boolean) || [text];
  function next() {
    if (run !== speechRun || !speechQueue.length) return;
    const utterance = new SpeechSynthesisUtterance(speechQueue.shift());
    utterance.lang = 'en-US'; utterance.rate = 0.82;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null;
    utterance.onend = next;
    utterance.onerror = e => { if (!['canceled', 'interrupted'].includes(e.error)) { stopSpeech(); toast('Audio could not play. Use the written script or try another browser.'); } };
    window.speechSynthesis.speak(utterance);
  }
  next();
}
function route() {
  stopSpeech();
  const id = location.hash.startsWith('#mission/') ? location.hash.slice(9) : '';
  mission = visible.find(m => m.id === id);
  if (mission) { state = load(mission); renderMission(); } else renderHome();
}
function routeArt() { return `<div class="route-art" aria-hidden="true"><span class="map-grid"></span><svg viewBox="0 0 360 260" fill="none"><path class="map-street" d="M0 62H360M0 190H360M65 0V260M285 0V260M0 130H140V260M215 0V130H360"/><path class="journey" d="M66 190H142V64H284"/><circle cx="66" cy="190" r="9" fill="currentColor"/><circle cx="284" cy="64" r="17" fill="#132537" stroke="currentColor" stroke-width="2"/><circle cx="284" cy="64" r="6" fill="currentColor"/></svg><span class="map-caption">YOUR NEXT CONVERSATION<br><strong>starts here.</strong></span></div>`; }
function renderHome() {
  const current = visible.find(m => m.status === 'current');
  const previous = visible.filter(m => m.status === 'previous');
  const progress = current ? load(current) : null;
  app.innerHTML = `<section class="home-intro"><span class="eyebrow">YOUR ENGLISH. IN ACTION.</span><h1>A little practice.<br><span>A more confident you.</span></h1><p>Hi, ${esc(current?.studentName || 'there')}. Keep your English moving between classes.<br class="desktop"> One mission. A few minutes. Say it out loud.</p></section>
    <section aria-labelledby="current-heading"><div class="section-heading"><h2 id="current-heading">Current Mission</h2><span class="pill">THIS WEEK</span></div>
    ${current ? `<article class="current-card"><div class="mission-card-content"><span class="eyebrow">${esc(current.week)} <span class="slash">/</span> REAL-LIFE ENGLISH</span><h3>${esc(current.title)}</h3><p class="key-phrase">${esc(current.keyPhrase)}</p><p class="muted">${esc(current.goal)}</p><div class="mission-meta"><span>◷ Go at your pace</span><span>◉ ${current.targetPhrases.length} phrases</span></div><a class="button primary" href="#mission/${esc(current.id)}">${progress.completedAt ? 'View result' : progress.step || progress.listenedFullAudio ? 'Continue mission' : 'Start mission'} <span>↗</span></a><span class="saved-label">${progress.completedAt ? `Last result: ${progress.result?.percentage ?? 0}% · Review anytime` : progress.step ? `Saved at step ${progress.step + 1} of 7` : 'Listen. Practice. Use it.'}</span></div>${routeArt()}</article>` : '<div class="panel">Your next mission is coming soon.</div>'}</section>
    <section class="practice-note"><span class="note-icon">↗</span><div><h2>Practice your voice, not just your memory.</h2><p>Find a quiet moment. Listen carefully. Say each phrase out loud.</p></div></section>
    <section id="previous" aria-labelledby="previous-heading"><div class="section-heading"><h2 id="previous-heading">Previous Missions</h2><span class="muted small">Keep it fresh.</span></div><div class="previous-list">${previous.map(m => { const saved = read(`rtc:last:${m.id}`); return `<a class="previous-card" href="#mission/${esc(m.id)}"><span class="week-tile">${esc(m.week.replace('Week ', 'W'))}</span><span class="previous-copy"><span class="eyebrow">REVIEW MISSION${saved ? ` · ${saved.percentage}% LAST SCORE` : ''}</span><h3>${esc(m.title)}</h3><p>${esc(m.keyPhrase)}</p></span><span class="arrow">↗</span></a>`; }).join('') || '<p class="muted">Completed weeks will be available here for review.</p>'}</div></section>`;
}
function renderMission() {
  if (state.completedAt && state.result) return renderComplete();
  const step = state.step;
  app.innerHTML = `<a class="back-link" href="#home">← Back to Missions</a><div class="flow-heading"><div><span class="eyebrow">${esc(mission.week)} <span class="slash">/</span> ${esc(mission.shortTitle)}</span><h1>${steps[step]}</h1></div><span class="step-count">${String(step + 1).padStart(2, '0')}<span> / 07</span></span></div><div class="step-track" aria-label="Step ${step + 1} of 7">${steps.map((s, i) => `<span class="${i <= step ? 'active' : ''}" title="${s}"></span>`).join('')}</div><section class="panel flow-panel">${stepBody(step)}</section><div class="flow-actions">${step > 0 ? '<button class="button secondary" data-action="back">← Previous step</button>' : '<span></span>'}<button class="button primary" data-action="next" ${canContinue() ? '' : 'disabled'}>${step === 6 ? 'Complete mission' : step === 0 ? 'Let’s begin' : 'Continue'} <span>→</span></button></div><p class="save-note">Progress saves automatically on this device.</p>`;
}
function check(id, label, checked, data = '') { return `<label class="check-row"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''} ${data}><span>${label}</span></label>`; }
function stepBody(step) {
  if (step === 0) return `<span class="pill">YOUR MISSION</span><h2 class="brief-title">${esc(mission.keyPhrase)}</h2><p>${esc(mission.goal)}</p><h3 class="spaced">Today you practice</h3><ul class="practice-list">${mission.todayYouPractice.map(p => `<li><span>↗</span>${esc(p)}</li>`).join('')}</ul><div class="callout">Say the phrases out loud — this is speaking practice. Written questions help you recall them.<br><span class="muted">One point per correct answer on your first check. Audio practice is tracked separately.</span></div>`;
  if (step === 1) return `<p class="lead">Listen first. Then make it your own.</p><p class="muted">Listen to the whole training and repeat out loud. Pause whenever you need.</p>${mission.fullAudioUrl ? `<audio controls preload="none" src="${esc(mission.fullAudioUrl)}">Your browser does not support audio.</audio><p class="small muted">If the recording does not load, use “Read training aloud” below.</p>` : '<span class="eyebrow audio-label">VOICE TRAINING · ENGLISH</span>'}<div class="audio-buttons"><button class="button secondary" data-action="full-audio">▶ ${mission.fullAudioUrl ? 'Read training aloud' : 'Play full training'}</button><button class="button quiet" data-action="stop-audio">■ Stop audio</button></div><details><summary>Read the full audio script</summary><p class="script">${esc(mission.fallbackAudioScript)}</p></details><button class="button ${state.listenedFullAudio ? 'success-button' : 'secondary'}" data-action="listened" aria-pressed="${state.listenedFullAudio}">${state.listenedFullAudio ? '✓ ' : ''}I listened to the full audio</button>${check('repeatedOutLoud', 'I repeated out loud', state.repeatedOutLoud)}<label class="field-label" for="difficultAudioPhrase">What phrase was difficult? <span class="muted">(optional)</span></label><textarea id="difficultAudioPhrase" rows="2" maxlength="1000" placeholder="A word or phrase to practice again…">${esc(state.difficultAudioPhrase)}</textarea><p class="small muted">Confirm that you listened and repeated to continue.</p>`;
  if (step === 2) return `<p class="lead">Say it. Repeat it. Make it familiar.</p><p class="muted">Listen to each phrase, then say it three times. Check it off when you’re done.</p><div class="phrase-list">${mission.targetPhrases.map((p, i) => `<article class="phrase-card"><div class="phrase-top"><span class="phrase-number">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(p.english)}</h3><p lang="pt-BR">${esc(p.portuguese)}</p></div><button class="play-button" data-action="phrase-audio" data-index="${i}" aria-label="Play audio: ${esc(p.english)}">▶<span> Play audio</span></button></div>${check('repeat-' + i, 'I said it 3 times', state.repeat.includes(i), `data-repeat="${i}"`)}</article>`).join('')}</div><details class="vocabulary"><summary>Useful recognition vocabulary · ${mission.vocabulary.length} expressions</summary><dl>${mission.vocabulary.map(p => `<div><dt>${esc(p.english)}</dt><dd lang="pt-BR">${esc(p.portuguese)}</dd></div>`).join('')}</dl></details><p id="repeat-count" class="small muted">${state.repeat.length} / ${mission.targetPhrases.length} phrases practiced</p>`;
  const section = questionSections[step - 3];
  const instructions = { chooseMeaning: 'Read the phrase. Choose its meaning in Portuguese.', completePhrase: 'Recall the missing word. Type it below.', typeSentence: 'How would you say this in English?', finalMission: 'Your turn in a real conversation. Use a short phrase from this mission.' };
  return `<p class="lead">${instructions[section]}</p><p class="muted">Check each answer to continue. Capitalization and punctuation don’t affect your score.${section === 'finalMission' ? ' This practice checks the sample phrases, so other valid wording may not be recognized.' : ''}</p><div class="questions">${mission[section + 'Questions'].map((q, i) => questionCard(section, q, i)).join('')}</div>`;
}
function questionCard(section, q, i) {
  const answer = state.answers[section][i];
  const correctVersion = q.answers?.[0] || q.options[q.answer];
  return `<article class="question-card"><span class="eyebrow">QUESTION ${String(i + 1).padStart(2, '0')}</span><h3 ${section === 'typeSentence' ? 'lang="pt-BR"' : ''}>${esc(q.prompt)}</h3>${section === 'chooseMeaning' ? `<div class="options">${q.options.map((option, j) => `<button class="option ${answer && j === q.answer ? 'correct-option' : ''} ${answer && answer.selected === j && !answer.correct ? 'wrong-option' : ''}" data-action="choose" data-index="${i}" data-option="${j}" ${answer ? 'disabled' : ''}><span>${String.fromCharCode(65 + j)}</span>${esc(option)}</button>`).join('')}</div>` : `<form data-question="${i}" data-section="${section}"><label class="sr-only" for="answer-${i}">Answer to ${esc(q.prompt)}</label><div class="answer-row"><input id="answer-${i}" name="answer" type="text" autocomplete="off" spellcheck="false" maxlength="500" placeholder="${section === 'completePhrase' ? 'Missing word…' : 'Your answer in English…'}" value="${esc(answer?.value ?? state.drafts[section + i] ?? '')}" ${answer ? 'disabled' : ''} required><button class="button secondary" type="submit" ${answer ? 'disabled' : ''}>Check</button></div></form>`}${answer ? `<div class="feedback ${answer.correct ? 'positive' : 'negative'}" role="status">${answer.correct ? '✓ Correct. Nicely done!' : answer.verdict === 'almost' ? `Almost. Check this version: <strong>${esc(correctVersion)}</strong>` : `Try again. Correct version: <strong>${esc(correctVersion)}</strong>`}${!answer.correct ? `<p class="small">Say the correct version out loud. Your first answer is saved; restart the mission for a new score.</p>` : ''}</div>` : ''}</article>`;
}
function canContinue() {
  if (state.step === 0) return true;
  if (state.step === 1) return state.listenedFullAudio && state.repeatedOutLoud;
  if (state.step === 2) return mission.targetPhrases.every((_, i) => state.repeat.includes(i));
  const section = questionSections[state.step - 3];
  return mission[section + 'Questions'].every((_, i) => !!state.answers[section][i]);
}
function updateContinue() { const button = app.querySelector('[data-action="next"]'); if (button) button.disabled = !canContinue(); }
function resultText(result) { return `RTC Lab Practice Mission completed ✅\nStudent: ${result.studentName}\nMission: ${result.week} — ${result.missionName}\nScore: ${result.totalScore}/${result.maxScore} (${result.percentage}%)\nPracticed phrases: ${mission.targetPhrases.filter((_, i) => state.repeat.includes(i)).map(p => p.english).join(' | ')}\nDifficult phrases: ${result.difficultPhrases.join(' | ') || 'None reported'}`; }
function finish() {
  const result = { studentName: mission.studentName, missionId: mission.id, missionName: mission.title, week: mission.week, missionVersion: mission.missionVersion, statusAtCompletion: mission.status, completedAt: new Date().toISOString(), ...summarize(mission, state), listenedFullAudio: state.listenedFullAudio, repeatedOutLoud: state.repeatedOutLoud, difficultAudioPhrase: state.difficultAudioPhrase, listenRepeatCompleted: state.repeat.length, userAgent: navigator.userAgent };
  result.copiedResultText = resultText(result);
  state.completedAt = result.completedAt; state.result = result; state.step = 7;
  save(); write(`rtc:last:${mission.id}`, result); renderComplete(); focusTop();
}
function renderComplete() {
  const r = state.result;
  app.innerHTML = `<a class="back-link" href="#home">← Back to Missions</a><section class="complete-header"><span class="complete-icon">✓</span><span class="eyebrow">${esc(mission.week)} · ${esc(mission.shortTitle)}</span><h1>Mission Complete</h1><p>You showed up. You spoke. Keep it going, ${esc(r.studentName)}.</p></section><section class="panel result-panel"><div class="score-block"><div class="score-ring" style="--score:${r.percentage}%"><strong>${r.percentage}<span>%</span></strong></div><div><span class="eyebrow">YOUR FINAL SCORE</span><h2>${r.totalScore} <span class="muted">/ ${r.maxScore} correct</span></h2><p class="muted">First answers · ${r.listenRepeatCompleted} phrases practiced out loud</p></div></div><div class="score-breakdown">${questionSections.map((s, i) => `<div><span>${steps[i + 3]}</span><strong>${r[s + 'Score']} / ${mission[s + 'Questions'].length}</strong></div>`).join('')}</div><h3>Practiced phrases</h3><div class="phrase-chips">${mission.targetPhrases.filter((_, i) => state.repeat.includes(i)).map(p => `<span>${esc(p.english)}</span>`).join('')}</div><h3 class="spaced">Difficult phrases</h3>${r.difficultPhrases.length ? `<ul class="difficult-list">${r.difficultPhrases.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : '<p class="muted">None reported. Come back to keep these phrases fresh.</p>'}<div class="result-actions"><button class="button primary" data-action="copy">Copy Result <span>↗</span></button><button class="button secondary" data-action="register" ${registering || state.registrationStatus === 'sent' ? 'disabled' : ''}>${registering ? 'Sending…' : state.registrationStatus === 'sent' ? 'Training sent' : 'Register Training'}</button><button class="button quiet" data-action="restart">Restart Mission</button><a class="button quiet" href="#home">Back to Missions</a></div><p class="registration-message" id="registration-message" role="status">${esc(state.registrationMessage || 'Share your progress with your teacher when you’re ready.')}</p><details><summary>View result text</summary><textarea class="copy-text" readonly rows="10" aria-label="Result summary">${esc(r.copiedResultText)}</textarea></details></section>`;
}
function focusTop() { app.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
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
    document.querySelector('#repeat-count').textContent = `${state.repeat.length} / ${mission.targetPhrases.length} phrases practiced`;
  } else return;
  save(); updateContinue();
});
function record(section, i, attempt) {
  if (state.answers[section][i]) return;
  state.answers[section][i] = attempt; save();
  const card = app.querySelectorAll('.question-card')[i];
  card.outerHTML = questionCard(section, mission[section + 'Questions'][i], i);
  const feedback = app.querySelectorAll('.question-card')[i].querySelector('.feedback');
  feedback.tabIndex = -1; feedback.focus({ preventScroll: true }); updateContinue();
}
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
  if (action === 'full-audio') speak(mission.fallbackAudioScript);
  if (action === 'stop-audio') stopSpeech();
  if (action === 'phrase-audio') speak(mission.targetPhrases[Number(button.dataset.index)].english);
  if (action === 'listened') { state.listenedFullAudio = !state.listenedFullAudio; save(); button.setAttribute('aria-pressed', state.listenedFullAudio); button.classList.toggle('success-button', state.listenedFullAudio); button.textContent = `${state.listenedFullAudio ? '✓ ' : ''}I listened to the full audio`; updateContinue(); }
  if (action === 'choose') {
    const i = Number(button.dataset.index), selected = Number(button.dataset.option), q = mission.chooseMeaningQuestions[i];
    record('chooseMeaning', i, { selected, value: q.options[selected], correct: selected === q.answer, verdict: selected === q.answer ? 'correct' : 'incorrect' });
  }
  if (action === 'next' && canContinue()) { stopSpeech(); if (state.step === 6) finish(); else { state.step++; save(); renderMission(); focusTop(); } }
  if (action === 'back') { stopSpeech(); state.step = Math.max(0, state.step - 1); save(); renderMission(); focusTop(); }
  if (action === 'restart') { state = fresh(); save(); renderMission(); focusTop(); }
  if (action === 'copy') {
    try { await navigator.clipboard.writeText(state.result.copiedResultText); toast('Result copied. Paste it into WhatsApp for your teacher.'); }
    catch { const field = app.querySelector('.copy-text'); field.closest('details').open = true; field.focus(); field.select(); toast('Select and copy the result text below.'); }
  }
  if (action === 'register' && !registering) {
    const submittedMission = mission, submittedState = state;
    registering = true; button.disabled = true; button.textContent = 'Sending…';
    try {
      const response = await registerTraining(submittedState.result);
      submittedState.registrationStatus = response.status; submittedState.registrationMessage = response.message;
    } catch (error) { submittedState.registrationMessage = error.message; }
    finally {
      registering = false; write(key(submittedMission), submittedState);
      if (mission === submittedMission && state === submittedState && state.result) renderComplete();
    }
  }
});
window.addEventListener('hashchange', () => { route(); focusTop(); });
window.addEventListener('pagehide', stopSpeech);
route();

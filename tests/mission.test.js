import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { missions } from '../src/missions.js';
import { normalize, evaluate, summarize, questionSections } from '../src/scoring.js';
import { buildResult, localISO } from '../src/results.js';

// Never call the deployed URL during automated tests. Use explicit test endpoints.
async function sheetsSource(endpoint = '') {
  return (await readFile(new URL('../src/sheets.js', import.meta.url), 'utf8'))
    .replace(/export const SHEETS_WEB_APP_URL = '[^']*';/, `export const SHEETS_WEB_APP_URL = '${endpoint}';`)
    .replace(/export /g, '');
}

test('Week 5 matches the complete brief and uses a new progress version', () => {
  const m = missions.find(m => m.id === 'week-05-transportation');
  assert.equal(m.missionVersion, 'v2');
  assert.deepEqual(questionSections.map(s => m[s + 'Questions'].length), [8, 12, 14, 9]);
  assert.equal(m.vocabulary.length, 12); assert.equal(m.recognitionPhrases.length, 10);
  assert.equal(m.targetPhrases.length, 16);
  assert.match(m.fallbackAudioScript, /Hi, Mateus\./);
  assert.match(m.fallbackAudioScript, /Part 4 — Travel survival/);
  assert.match(m.fallbackAudioScript, /Final round/);
  assert.match(m.fallbackAudioScript, /I don’t understand/);
  assert.match(m.fallbackAudioScript, /Let me think/);
  assert.equal(m.completePhraseQuestions[5].hint, 'Vire à direita.');
  assert.equal(m.completePhraseQuestions[6].hint, 'Vire à esquerda.');
});

test('weekly content is complete, uniquely identified and has exactly one current mission', () => {
  assert.equal(missions.filter(m => m.status === 'current').length, 1);
  assert.equal(new Set(missions.map(m => m.id)).size, missions.length);
  for (const m of missions) {
    for (const field of ['id', 'week', 'title', 'shortTitle', 'missionVersion', 'studentName', 'keyPhrase', 'goal', 'fallbackAudioScript']) assert.ok(m[field]?.trim(), field);
    assert.ok(['current', 'previous', 'draft'].includes(m.status));
    assert.ok(m.todayYouPractice.length && m.targetPhrases.length && m.vocabulary.length);
    assert.equal(typeof m.fullAudioUrl, 'string');
    for (const p of [...m.targetPhrases, ...m.vocabulary]) assert.ok(p.english && p.portuguese);
    for (const s of questionSections) {
      assert.ok(m[s + 'Questions'].length);
      for (const q of m[s + 'Questions']) {
        assert.ok(q.prompt);
        if (s === 'chooseMeaning') assert.ok(Number.isInteger(q.answer) && q.options[q.answer]);
        else assert.ok(q.answers.length && q.answers.every(a => typeof a === 'string' && a.trim()));
      }
    }
  }
});
test('normalization accepts case, punctuation, extra spaces and curly apostrophes', () => {
  assert.equal(normalize('  IT’S  on the RIGHT! '), "it's on the right");
  assert.equal(evaluate('   STRAIGHT  ', ['straight']), 'correct');
  assert.equal(evaluate("It's on the right", ['It’s on the right.']), 'correct');
  assert.equal(evaluate('Can you show me on the mp?', ['Can you show me on the map?']), 'almost');
  assert.equal(evaluate('I want a burger', ['Can you show me on the map?']), 'incorrect');
  assert.equal(evaluate('', ['taxi']), 'incorrect');
});
function answered(m, correct = true) {
  return { difficultAudioPhrase: 'Go straight.', answers: Object.fromEntries(questionSections.map(s => [s, Object.fromEntries(m[s + 'Questions'].map((q, i) => [i, { correct, value: correct ? q.answers?.[0] || q.options[q.answer] : 'wrong' }]))])) };
}
test('both missions score correctly; errors are preserved and difficult phrases deduplicated', () => {
  for (const m of missions) {
    const state = answered(m);
    const full = summarize(m, state);
    assert.equal(full.percentage, 100);
    assert.equal(full.totalScore, full.maxScore);
    state.answers.completePhrase[0] = { correct: false, value: 'train' };
    const oneWrong = summarize(m, state);
    assert.equal(oneWrong.totalScore, full.maxScore - 1);
    assert.equal(oneWrong.wrongAnswers.length, 1);
    assert.equal(oneWrong.wrongAnswers[0].answer, 'train');
    assert.ok(oneWrong.difficultPhrases.includes(m.completePhraseQuestions[0].fullPhrase));
    assert.equal(summarize(m, answered(m, false)).percentage, 0);
  }
});
test('registration with no endpoint returns actionable message without network access', async () => {
  const context = vm.createContext({ fetch: () => assert.fail('An empty endpoint must never send a request') });
  vm.runInContext(await sheetsSource(), context);
  const result = await context.registerTraining({});
  assert.equal(result.status, 'disconnected');
  assert.match(result.message, /Registration not connected yet/);
});
test('authenticated registration copies data without anonymous network requests', async () => {
  let copied;
  const context=vm.createContext({navigator:{clipboard:{writeText:async text=>{copied=text;}}},fetch:()=>assert.fail('Must not fetch a login-protected endpoint anonymously')});
  vm.runInContext(await sheetsSource('https://script.google.com/macros/s/test/exec'),context);
  const result=await context.registerTraining({studentName:'Mateus',missionId:'test',registrationStatus:'old',registrationMessage:'old'});
  assert.equal(result.status,'awaiting-login');
  assert.match(result.message,/not registered yet/);
  assert.deepEqual(JSON.parse(copied),{studentName:'Mateus',missionId:'test'});
  context.navigator.clipboard.writeText=async()=>{throw Error('denied');};
  const fallback=await context.registerTraining({studentName:'Mateus'});
  assert.equal(fallback.status,'awaiting-login');
  assert.match(fallback.message,/Copy the registration data below/);
});
test('invalid and whitespace-only endpoint configurations preserve the copy-result fallback', async () => {
  for (const endpoint of ['   ', 'https://example.com/exec', 'https://script.google.com/macros/s/test/dev']) {
    const context = vm.createContext({ fetch: () => assert.fail('Invalid endpoint must not send data') });
    vm.runInContext(await sheetsSource(endpoint), context);
    if (!endpoint.trim()) assert.equal((await context.registerTraining({})).status, 'disconnected');
    else await assert.rejects(context.registerTraining({}), /Copy your result/);
  }
});
test('Apps Script creates 23 columns, persists JSON, deduplicates and rejects malformed data', async () => {
  const rows = [];
  const sheet = { appendRow: row => rows.push(row), getLastRow: () => rows.length, setFrozenRows() {}, getRange: (r, c, n, w) => ({ setFontWeight() {}, getValues: () => rows.slice(r - 1, r - 1 + n).map(row => row.slice(c - 1, c - 1 + w)) }) };
  let created = false;
  const properties = new Map();
  const receipts = new Map();
  const book = { getId: () => 'test-sheet-id', getSheetByName: () => created ? sheet : null, insertSheet: name => { assert.equal(name, 'RTC Lab Practice Logs'); created = true; return sheet; } };
  const context = vm.createContext({ console: { error() {}, log() {} }, CacheService: { getScriptCache: () => ({ put: (key, value) => receipts.set(key, value), get: key => receipts.get(key) }) }, PropertiesService: { getScriptProperties: () => ({ setProperty: (key, value) => properties.set(key, value), getProperty: key => properties.get(key) }) }, LockService: { getScriptLock: () => ({ waitLock() {}, hasLock: () => true, releaseLock() {} }) }, SpreadsheetApp: { flush() {}, getActiveSpreadsheet: () => book, openById: id => { assert.equal(id, 'test-sheet-id'); return book; } }, ContentService: { MimeType: { JSON: 'json', JAVASCRIPT: 'js' }, createTextOutput: value => ({ setMimeType: type => type === 'js' ? value : Object.assign(JSON.parse(value), { getContent: () => value }) }) } });
  vm.runInContext(await readFile(new URL('../apps-script/Code.gs', import.meta.url), 'utf8'), context);
  const m = missions[0];
  const payload = { studentName: m.studentName, missionId: m.id, missionName: m.title, week: m.week, missionVersion: m.missionVersion, statusAtCompletion: m.status, completedAt: '2026-09-16T12:00:00.000Z', ...summarize(m, answered(m)), listenedFullAudio: true, repeatedOutLoud: true, difficultAudioPhrase: '=IMPORTXML("test")', listenRepeatCompleted: 16, copiedResultText: 'summary', userAgent: 'test' };
  payload.registrationToken = 'a'.repeat(32);
  const submit = p => context.doPost({ postData: { contents: JSON.stringify(p) } });
  assert.equal(submit(payload).success, false);
  assert.equal(receipts.get('receipt:' + payload.registrationToken), 'error');
  assert.equal(rows.length, 0);
  context.setup();
  assert.equal(properties.get('RTC_SPREADSHEET_ID'), 'test-sheet-id');
  context.SpreadsheetApp.getActiveSpreadsheet = () => { throw new Error('Unavailable in Web App context'); };
  assert.equal(submit(payload).success, true);
  assert.equal(receipts.get('receipt:' + payload.registrationToken), 'registered');
  const loginPage=context.registrationPage_();
  assert.match(loginPage,/google.script.run.withSuccessHandler/);
  assert.match(loginPage,/registerAuthenticatedTraining/);
  assert.match(loginPage,/Registration data/);
  assert.equal(context.registerAuthenticatedTraining(JSON.stringify(payload)).success,true);
  assert.equal(context.registerAuthenticatedTraining('not json').success,false);
  assert.equal(context.registerAuthenticatedTraining(null).success,false);
  assert.equal(rows[0].length, 23); assert.equal(rows[1].length, 23);
  assert.equal(rows[1][13], "'=IMPORTXML(\"test\")");
  assert.ok(Array.isArray(JSON.parse(rows[1][19])));
  assert.equal(submit(payload).success, true); assert.equal(rows.length, 2);
  assert.equal(submit({ ...payload, completedAt: '2026-09-16T09:00:00.000-03:00' }).success, true); assert.equal(rows.length, 2);
  assert.equal(submit({ ...payload, completedAt: '2026-09-17T12:00:00.000Z' }).success, true); assert.equal(rows.length, 3);
  assert.equal(submit({}).success, false); assert.equal(rows.length, 3);
  assert.equal(submit({ ...payload, listenedFullAudio: 'yes' }).success, false);
  assert.equal(context.doPost({ postData: { contents: 'bad json' } }).success, false);
});

test('practice retries preserve first score, verdicts and repeated-prompt identities', () => {
  const m = missions[0], state = answered(m);
  state.answers.completePhrase[5] = { correct: true, value: 'right', verdict: 'correct', attempts: [{ correct: false, value: 'righ', verdict: 'almost' }, { correct: true, value: 'right', verdict: 'correct' }] };
  state.answers.completePhrase[6] = { correct: false, value: 'straight', verdict: 'incorrect' };
  const result = summarize(m, state);
  assert.equal(result.totalScore, 41);
  assert.equal(result.answerSummary.almost, 1);
  assert.equal(result.answerSummary.incorrect, 1);
  assert.equal(result.wrongAnswers[0].verdict, 'almost');
  assert.equal(result.wrongAnswers[0].attemptNumber, 1);
  assert.ok(result.difficultPhrases.includes('Turn right.'));
  assert.ok(result.difficultPhrases.includes('Turn left.'));
});

test('result is a historical snapshot, with local ISO, completed items and WhatsApp list', () => {
  const m = missions[0], state = { ...answered(m), repeat: m.targetPhrases.map((_, i) => i), listenedFullAudio: true, repeatedOutLoud: true };
  const date = new Date('2026-09-17T15:00:00.000Z');
  const result = buildResult(m, state, 'test', date);
  assert.equal(result.maxScore, 43); assert.equal(result.completedItems, 61);
  assert.equal(result.practicedPhrases.length, 16);
  assert.equal(result.sectionTotals.finalMission, 9);
  assert.match(result.copiedResultText, /I practiced:\n- I need an Uber\./);
  assert.match(result.copiedResultText, /Send this result to your teacher on WhatsApp\./);
  assert.match(localISO(date), /[+-]\d{2}:\d{2}$/);
  assert.equal(Date.parse(result.completedAt), date.getTime());
});

test('Google registration page previews data and confirms only after server success', async () => {
  const server = vm.createContext({});
  vm.runInContext(await readFile(new URL('../apps-script/Code.gs', import.meta.url), 'utf8'), server);
  const html = server.registrationPage_();
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const elements = Object.fromEntries(['registration', 'payload', 'submit', 'preview', 'status'].map(id => [id, { value: '', textContent: '', disabled: true, handlers: {}, addEventListener(event, fn) { this.handlers[event] = fn; } }]));
  let success, failure, sent, calls = 0;
  const runner = { withSuccessHandler(fn) { success = fn; return runner; }, withFailureHandler(fn) { failure = fn; return runner; }, registerAuthenticatedTraining(data) { sent = data; calls++; } };
  const client = vm.createContext({ document: { getElementById: id => elements[id] }, google: { script: { run: runner } }, setTimeout, clearTimeout });
  vm.runInContext(script, client);
  elements.payload.value = 'WhatsApp summary'; elements.payload.handlers.input();
  assert.equal(elements.submit.disabled, true);
  assert.match(elements.status.textContent, /not the WhatsApp summary/);
  const payload = { studentName: '<img src=x>', week: 'Week 5', missionName: 'Transportation', totalScore: 40, maxScore: 43 };
  elements.payload.value = JSON.stringify(payload); elements.payload.handlers.input();
  assert.equal(elements.submit.disabled, false);
  assert.match(elements.preview.textContent, /Score: 40 \/ 43/);
  elements.registration.handlers.submit({ preventDefault() {} });
  elements.registration.handlers.submit({ preventDefault() {} });
  assert.equal(calls, 1); assert.deepEqual(JSON.parse(sent), payload);
  assert.equal(elements.submit.disabled, true);
  failure(); assert.match(elements.status.textContent, /couldn’t register/);
  elements.registration.handlers.submit({ preventDefault() {} });
  success({ success: false, error: 'Run setup first' });
  assert.match(elements.status.textContent, /Run setup first/);
  elements.registration.handlers.submit({ preventDefault() {} });
  success({ success: true });
  assert.match(elements.status.textContent, /Training registered ✅/);
  assert.equal(elements.submit.disabled, true);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { missions } from '../src/missions.js';
import { normalize, evaluate, summarize, questionSections } from '../src/scoring.js';
import { registerTraining } from '../src/sheets.js';

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
  const result = await registerTraining({});
  assert.equal(result.status, 'disconnected');
  assert.match(result.message, /Registration not connected yet/);
});
test('configured registration posts JSON without preflight and handles network failure', async () => {
  const source = (await readFile(new URL('../src/sheets.js', import.meta.url), 'utf8')).replace("SHEETS_WEB_APP_URL = ''", "SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/test/exec'").replace(/export /g, '');
  let sent;
  const context = vm.createContext({ AbortController, setTimeout, clearTimeout, fetch: async (url, options) => { sent = { url, options }; return { type: 'opaque' }; } });
  vm.runInContext(source, context);
  const payload = { studentName: 'Mateus', missionId: 'test' };
  assert.equal((await context.registerTraining(payload)).status, 'sent');
  assert.equal(sent.options.method, 'POST');
  assert.equal(sent.options.mode, 'no-cors');
  assert.match(sent.options.headers['Content-Type'], /^text\/plain/);
  assert.deepEqual(JSON.parse(sent.options.body), payload);
  context.fetch = async () => { throw new Error('offline'); };
  await assert.rejects(context.registerTraining(payload), /could not confirm/);
});
test('Apps Script creates 23 columns, persists JSON, deduplicates and rejects malformed data', async () => {
  const rows = [];
  const sheet = { appendRow: row => rows.push(row), getLastRow: () => rows.length, setFrozenRows() {}, getRange: (r, c, n, w) => ({ setFontWeight() {}, getValues: () => rows.slice(r - 1, r - 1 + n).map(row => row.slice(c - 1, c - 1 + w)) }) };
  let created = false;
  const context = vm.createContext({ console: { error() {} }, LockService: { getScriptLock: () => ({ waitLock() {}, hasLock: () => true, releaseLock() {} }) }, SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => created ? sheet : null, insertSheet: name => { assert.equal(name, 'RTC Lab Practice Logs'); created = true; return sheet; } }) }, ContentService: { MimeType: { JSON: 'json' }, createTextOutput: value => ({ setMimeType: () => JSON.parse(value) }) } });
  vm.runInContext(await readFile(new URL('../apps-script/Code.gs', import.meta.url), 'utf8'), context);
  const m = missions[0];
  const payload = { studentName: m.studentName, missionId: m.id, missionName: m.title, week: m.week, missionVersion: m.missionVersion, statusAtCompletion: m.status, completedAt: '2026-09-16T12:00:00.000Z', ...summarize(m, answered(m)), listenedFullAudio: true, repeatedOutLoud: true, difficultAudioPhrase: '=IMPORTXML("test")', listenRepeatCompleted: 16, copiedResultText: 'summary', userAgent: 'test' };
  const submit = p => context.doPost({ postData: { contents: JSON.stringify(p) } });
  assert.equal(submit(payload).success, true);
  assert.equal(rows[0].length, 23); assert.equal(rows[1].length, 23);
  assert.equal(rows[1][13], "'=IMPORTXML(\"test\")");
  assert.ok(Array.isArray(JSON.parse(rows[1][19])));
  assert.equal(submit(payload).success, true); assert.equal(rows.length, 2);
  assert.equal(submit({ ...payload, completedAt: '2026-09-17T12:00:00.000Z' }).success, true); assert.equal(rows.length, 3);
  assert.equal(submit({}).success, false); assert.equal(rows.length, 3);
  assert.equal(context.doPost({ postData: { contents: 'bad json' } }).success, false);
});

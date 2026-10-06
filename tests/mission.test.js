import { expressionChunks, chunkAnswer } from '../src/build.js';
import { preferredVoice } from '../src/audio.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { missions } from '../src/missions.js';
import { normalize, evaluate, summarize, questionSections, acceptedAnswers, reviewItems, uniquePhrases } from '../src/scoring.js';
import { phases, shuffledIndices, starText, completionFeedback, addReward, rewardSummary } from '../src/practice.js';
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
  assert.match(m.fallbackAudioScript, /This is your Transportation Day training/);
  assert.match(m.fallbackAudioScript, /Part 5 — Travel survival questions/);
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
test('direct registration posts JSON and accepts only explicit confirmation', async () => {
  let request;
  const context = vm.createContext({ AbortController, setTimeout, clearTimeout, fetch: async (url, options) => {
    request = {url, options}; return {ok:true, text:async () => '{"success":true}'};
  }});
  vm.runInContext(await sheetsSource('https://script.google.com/macros/s/test/exec'), context);
  const payload = buildResult(missions.find(m => m.id === 'week-05-transportation'), { ...answered(missions.find(m => m.id === 'week-05-transportation'), true), repeat: [], listenedFullAudio: true, repeatedOutLoud: true, difficultAudioPhrase: '' }, 'test-agent');
  payload.registrationStatus = 'error';
  assert.equal((await context.submitTrainingLog(payload)).success, true);
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['Content-Type'], 'text/plain;charset=utf-8');
  const body = JSON.parse(request.options.body);
  assert.equal(Object.keys(body).length, 22);
  assert.equal(body.missionId, payload.missionId);
  assert.equal(body.registrationStatus, undefined);
  for (const [ok, text] of [[true, '<html>Sign in</html>'],[true,'null'],[true,'{}'],[true,'{"success":false,"error":"Sheet missing"}'],[false,'{"success":true}']]) {
    context.fetch = async () => ({ok, text:async () => text});
    assert.equal((await context.submitTrainingLog(payload)).success, false);
  }
  for (const name of ['Error','AbortError']) {
    context.fetch = async () => { const e = new Error('request failed'); e.name = name; throw e; };
    assert.equal((await context.submitTrainingLog(payload)).success, false);
  }
});
test('missing or invalid registration URL never sends data', async () => {
  for (const endpoint of ['', '   ', 'https://example.com/exec', 'https://script.google.com/macros/s/test/dev']) {
    const context = vm.createContext({fetch: () => assert.fail('Invalid endpoint sent a request')});
    vm.runInContext(await sheetsSource(endpoint), context);
    assert.equal((await context.submitTrainingLog({})).success, false);
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
  const m = missions.find(m => m.id === 'week-05-transportation');
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
  const m = missions.find(m => m.id === 'week-05-transportation'), state = answered(m);
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
  const m = missions.find(m => m.id === 'week-05-transportation'), state = { ...answered(m), repeat: m.targetPhrases.map((_, i) => i), listenedFullAudio: true, repeatedOutLoud: true };
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

test('audio scripts preserve pauses and chapter boundaries at all speeds', async () => {
  const { speechSegments, estimatedSeconds, speechRates } = await import('../src/audio.js');
  assert.deepEqual(speechSegments('Hello. [pause] Again.'), [{text:'Hello.'},{pause:3000},{text:'Again.'}]);
  const m = missions.find(m => m.id === 'week-05-transportation');
  assert.equal(m.audioRateMultiplier, 0.9);
  assert.deepEqual(m.audioChapters.map(c => c.title), ['Core Training', 'Extra Directions Review']);
  const offset = m.fallbackAudioScript.indexOf(m.audioChapters[1].startsAt);
  assert.ok(offset > 0);
  assert.equal(m.fallbackAudioScript.match(/You want to see the map/g).length, 1);
  assert.match(missions.find(m => m.id === 'week-04-food-ordering').fallbackAudioScript, /I went to the supermarket/);
  assert.match(missions.find(m => m.id === 'week-04-food-ordering').fallbackAudioScript, /I’ll be back right away/);
  const prefix = m.fallbackAudioScript.slice(0, offset);
  assert.ok(estimatedSeconds(prefix, speechRates.slow * .9) > estimatedSeconds(prefix, speechRates.normal * .9));
  assert.ok(speechSegments(m.fallbackAudioScript).every(item => item.pause || !item.text.includes('[pause]')));
});

test('legacy practice arrays are normalized without discarding malformed answers', async () => {
  const context=vm.createContext({});
  vm.runInContext(await sheetsSource(),context);
  const parsed=JSON.parse(context.registrationData({difficultPhrases:'["Go straight."]',wrongAnswers:'[{"value":"test"}]'}));
  assert.deepEqual(parsed.difficultPhrases,['Go straight.']);
  assert.deepEqual(parsed.wrongAnswers,[{value:'test'}]);
  assert.deepEqual(JSON.parse(context.registrationData({})).wrongAnswers,[]);
  assert.throws(()=>context.registrationData({wrongAnswers:'broken JSON'}),/Invalid saved wrongAnswers/);
});


test('automatic registration persists success across rerenders, reloads and repeated clicks', async () => {
  const {createRegistration, submissionId} = await import('../src/registration.js');
  const store=new Map(); let calls=0, resolve;
  const options={read:key=>store.get(key),write:(key,value)=>store.set(key,value),submit:()=>{calls++;return new Promise(done=>{resolve=done;});}};
  const service=createRegistration(options);
  const result={studentName:'Test',missionId:'week-05',missionVersion:'v2',completedAt:'2026-09-22T12:00:00Z'};
  const first=service.send(result);
  assert.equal(service.status(result),'pending');
  assert.equal(service.send(result,true),first);
  await Promise.resolve(); assert.equal(calls,1);
  resolve({success:true}); await first;
  assert.equal(store.get('registrationStatus:'+submissionId(result)),'submitted');
  await createRegistration(options).send({...result}); assert.equal(calls,1);
  assert.equal(createRegistration(options).status({...result}),'submitted');
});
test('failed and interrupted submissions require explicit retry; new completions submit separately', async () => {
  const {createRegistration, submissionId} = await import('../src/registration.js');
  const store=new Map(); let calls=0;
  const options={read:key=>store.get(key),write:(key,value)=>store.set(key,value),submit:async()=>{calls++;return {success:calls>1};}};
  const result={studentName:'Test',missionId:'week-04',missionVersion:'v1',completedAt:'2026-09-22T12:00:00Z'};
  const service=createRegistration(options);
  assert.equal(await service.send(result),'failed');
  await service.send(result); assert.equal(calls,1);
  assert.equal(await service.send(result,true),'submitted'); assert.equal(calls,2);
  const next={...result,completedAt:'2026-09-22T13:00:00Z'};
  store.set('registrationStatus:'+submissionId(next),'pending');
  const reloaded=createRegistration(options);
  assert.equal(reloaded.status(next),'failed'); await reloaded.send(next); assert.equal(calls,2);
  await reloaded.send(next,true); assert.equal(calls,3);
});
test('Mission Complete starts automatic registration and retry uses the same coordinator', async () => {
  const source = await readFile(new URL('../src/main.js',import.meta.url),'utf8');
  const start=source.indexOf('function renderComplete('), end=source.indexOf('function registrationPanel(',start);
  let calls=0, resolve;
  const {createRegistration}=await import('../src/registration.js');
  const store=new Map(); const result={studentName:'Test',missionId:'test',missionVersion:'v1',completedAt:'2026-09-22T12:00:00Z',difficultPhrases:[],totalScore:0,maxScore:0};
  const registrations=createRegistration({read:k=>store.get(k),write:(k,v)=>store.set(k,v),submit:()=>{calls++;return new Promise(done=>resolve=done);}});
  const context=vm.createContext({review:null,reviewItems,uniquePhrases,starText,completionFeedback,read:()=>null,missionLabel: value => String(value ?? '').replace(/Week/g,'Mission'),console:{debug(){}},location:{hash:'#result/test'},state:{result},mission:{id:'test'},registrations,submissionId:()=> 'test',resultKey:()=> 'test',justSubmitted:new Set(),manualRegistrations:new Set(),esc:String,app:{innerHTML:''},questionSections:[],REGISTRATION_ERROR:'fallback',SHEETS_WEB_APP_URL:'',persistRegistration(){}});
  vm.runInContext(source.slice(start,end),context);
  context.renderComplete(); context.renderComplete();
  await Promise.resolve(); assert.equal(calls,1); assert.match(context.app.innerHTML,/Submitting training/);
  resolve({success:true}); await new Promise(done=>setTimeout(done,0));
  assert.match(context.app.innerHTML,/Training submitted ✅/); assert.match(context.app.innerHTML,/Copy Result/);
  context.renderComplete(); assert.equal(calls,1);
});

test('Travel Review Pack has complete previous missions and accepted answers', () => {
 const reviews=missions.filter(m=>m.category==='Travel Review Pack');
 assert.equal(reviews.length,3);
 assert.deepEqual(reviews.map(m=>questionSections.map(s=>m[s+'Questions'].length)),[[6,8,8,7],[8,10,10,10],[8,10,11,12]]);
 assert.equal(missions.find(m=>m.status==='current').id,'mission-6-shopping-buying');
 for(const m of reviews) {
  assert.equal(m.status,'previous'); assert.ok(m.finalMissionScenario); assert.ok(m.missionCompleteMessage); assert.ok(m.mainPhrases.length);
  for(const section of questionSections.slice(1)) for(const q of m[section+'Questions']) for(const answer of q.answers) assert.equal(evaluate(answer,q.answers),'correct');
 }
 assert.ok(reviews[0].typeSentenceQuestions[3].answers.includes('Can repeat, please?'));
});

test('completion resets saved practice while preserving result and submission screen', async () => {
 const source=await readFile(new URL('../src/main.js',import.meta.url),'utf8');
 const store=new Map(); const m={id:'test',missionVersion:'v1'};
 const result={missionId:'test',completedAt:'2026-09-29T12:00:00Z'};
 let rendered=0;
 const ctx=vm.createContext({addReward,questionSections,read:k=>store.get(k),write:(k,v)=>store.set(k,v),key:()=> 'progress',mission:m,state:{step:6},navigator:{userAgent:'test'},buildResult:()=>result,renderComplete:()=>rendered++,focusTop(){}});
 vm.runInContext(source.slice(source.indexOf('function fresh()'), source.indexOf('function save()')),ctx);
 vm.runInContext(source.slice(source.indexOf('function finish()'),source.indexOf('function renderComplete(')),ctx);
 ctx.finish();
 assert.equal(rendered,1); assert.equal(ctx.state.result,result); assert.equal(ctx.state.step,7);
 assert.equal(store.get('rtc:last:test'),result); assert.equal(store.get('progress').step,0);
 assert.equal(ctx.load(m).completedAt,null);
 store.set('progress',{step:7,completedAt:result.completedAt,result});
 assert.equal(ctx.load(m).step,0);
 store.set('progress',{step:3,answers:{},repeat:[],completedAt:null});
 assert.equal(ctx.load(m).step,3);
});

test('Mission 7 is next with all phrases, exercises and accepted answers', () => {
const m=missions.find(m=>m.id==='mission-7-problems-help');
assert.equal(m.status,'draft');assert.equal(m.isNext,true);assert.equal(m.week,'Mission 7');assert.equal(m.targetPhrases.length,20);
assert.deepEqual(questionSections.map(s=>m[s+'Questions'].length),[8,12,14,10]);
for(const s of questionSections.slice(1))for(const q of m[s+'Questions'])for(const answer of q.answers)assert.equal(evaluate(answer,q.answers),'correct');
assert.equal(evaluate('big',m.completePhraseQuestions[6].answers),'correct');
assert.equal(summarize(m,answered(m,true)).maxScore,44);
assert.equal(missions.find(m=>m.id==='week-05-transportation').status,'previous');
});

test('Mission 6 is current, complete and accepts all supplied alternatives', () => {
const m=missions.find(m=>m.id==='mission-6-shopping-buying');assert.equal(m.status,'current');assert.equal(m.week,'Mission 6');
assert.equal(m.targetPhrases.length,17);assert.equal(m.recognitionPhrases.length,12);assert.equal(m.vocabulary.length,25);
assert.deepEqual(questionSections.map(s=>m[s+'Questions'].length),[10,12,15,14]);
for(const section of questionSections.slice(1))for(const q of m[section+'Questions'])for(const a of q.answers)assert.equal(evaluate(a,q.answers),'correct');
assert.equal(summarize(m,answered(m,true)).maxScore,51);assert.match(m.fallbackAudioScript,/Part 6 — Recovery/);assert.match(m.fallbackAudioScript,/Final round/);
assert.equal(missions.filter(m=>m.status==='previous').length,5);
});

test('Mission 5 exact and normalized answers score in every typed section', () => {
  const m = missions.find(m => m.id === 'week-05-transportation');
  const state = answered(m);
  for (const section of questionSections.slice(1)) {
    for (const [i, q] of m[section + 'Questions'].entries()) {
      for (const answer of acceptedAnswers(q)) {
        for (const value of [answer, '  ' + answer.toUpperCase().replaceAll(' ', '   ') + '  ', answer.replaceAll('’', "'").replace(/[.!?]$/, '') + '!']) {
          const verdict = evaluate(value, q);
          assert.equal(verdict, 'correct', `${section} ${i}: ${value}`);
          state.answers[section][i] = { value, correct: verdict === 'correct', verdict };
        }
      }
    }
  }
  assert.equal(summarize(m, state).totalScore, 43);
  assert.equal(evaluate('Can you repeat please', m.typeSentenceQuestions[12]), 'correct');
  assert.equal(evaluate('another size', { expectedAnswer:'different size', acceptedAnswers:['another size'] }), 'correct');
  assert.equal(evaluate('taxy', { answers:['taxi'] }) === 'correct', false);
});

test('review uses first errors, stable IDs and normalized phrase deduplication', () => {
  const m = missions.find(m => m.id === 'week-05-transportation');
  const s = answered(m);
  s.answers.chooseMeaning[1] = { correct:false, value:'left' };
  s.answers.completePhrase[5] = { correct:true, attempts:[{correct:false,value:'left'},{correct:true,value:'right'}] };
  // A later error on an originally correct item is evidence, not a review target.
  s.answers.typeSentence[0] = { correct:false, attempts:[{correct:true,value:'I need an Uber.'},{correct:false,value:'oops'}] };
  const r = summarize(m,s);
  assert.equal(r.totalScore,41);
  assert.equal(r.wrongAnswers.length,3);
  assert.equal(r.difficultPhrases.length,1);
  assert.equal(normalize(r.difficultPhrases[0]),'turn right');
  const items = reviewItems(m,r.wrongAnswers);
  assert.equal(items.length,1);
  assert.match(items[0].id,/chooseMeaning-02$/);
  assert.equal(reviewItems(m,[{...r.wrongAnswers[0],questionIndex:99}])[0].index,1);
});

test('word banks are explicit and unambiguous; phases and rewards are independent of scoring', () => {
  const m = missions.find(m => m.id === 'week-05-transportation');
  for (const q of m.completePhraseQuestions) {
    assert.ok(q.hint);
    assert.equal(q.wordBank.filter(word => evaluate(word,q) === 'correct').length,1);
  }
  assert.deepEqual(phases.map(p=>p.number),[1,2,2,3,4,4,5]);
  assert.deepEqual([...shuffledIndices(4,()=>0)].sort(),[0,1,2,3]);
  assert.notDeepEqual(shuffledIndices(4,()=>0),[0,1,2,3]);
  assert.deepEqual([0,59,60,84,85,100].map(starText),['★☆☆','★☆☆','★★☆','★★☆','★★★','★★★']);
  const r={missionId:m.id,missionVersion:m.missionVersion,completedAt:'2026-10-06T12:00:00Z',totalScore:43,percentage:100};
  const original=JSON.stringify(r), ledger=addReward({},r);
  assert.deepEqual(rewardSummary(ledger),{xp:305,completed:1});
  assert.equal(addReward(ledger,{...r}),ledger);
  assert.equal(JSON.stringify(r),original);
});

// Exercise the actual app handlers with isolated device storage and a fake
// transport. No test data or synthetic student results reach Google Sheets.
async function appHarness(saved = []) {
  const registration = await import('../src/registration.js');
  const audio = await import('../src/audio.js');
  const results = await import('../src/results.js');
  const labels = await import('../src/labels.js');
  const handlers = {}, store = new Map(saved), requests = [], clipboard = [];
  const control = {focus(){},matches:()=>true,disabled:false,setAttribute(){},classList:{add(){},remove(){}}};
  const app = {innerHTML:'',focus(){},querySelector:()=>control,querySelectorAll:()=>[],addEventListener:(name,fn)=>handlers[name]=fn};
  const context = vm.createContext({ ...registration,...audio,...results,...labels,phases,shuffledIndices,starText,completionFeedback,addReward,rewardSummary,expressionChunks,chunkAnswer,missions,evaluate,questionSections,acceptedAnswers,normalize,reviewItems,uniquePhrases,
    console:{debug(){}},document:{querySelector:selector=>selector==='#app'?app:control},location:{hash:'#home'},navigator:{userAgent:'isolated-test',clipboard:{writeText:async text=>clipboard.push(text)}},
    window:{addEventListener(){},scrollTo(){}},localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)},
    setTimeout:()=>0,clearTimeout(){},submitTrainingLog:async r=>{requests.push(JSON.parse(JSON.stringify(r)));return {success:true};},REGISTRATION_ERROR:'fallback',registrationData:JSON.stringify,SHEETS_WEB_APP_URL:''
  });
  const source=(await readFile(new URL('../src/main.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,'');
  vm.runInContext(source,context);
  const click = (action, data={}) => handlers.click({target:{closest:()=>({disabled:false,dataset:{action,...data}})}});
  const submit = (section,index,value) => {
    const input={value,setCustomValidity(){},reportValidity(){},addEventListener(){}};
    const form={dataset:{section,question:String(index)},elements:{answer:input}};
    handlers.submit({preventDefault(){},target:{closest:()=>form}});
  };
  return {context,app,store,requests,clipboard,click,submit,handlers};
}

test('actual app handlers preserve first scores through hard mode, retry, completion and review', async () => {
  const h=await appHarness(), m=missions.find(m=>m.id==='week-05-transportation');
  h.context.location.hash='#mission/'+m.id;h.context.route();
  assert.match(h.app.innerHTML,/01<span> \/ 05/);
  vm.runInContext("state.step=4; state.listenedFullAudio=true; state.repeatedOutLoud=true; state.repeat=mission.targetPhrases.map((_,i)=>i);",h.context);
  // A historical partial practice (existing schema, no new UI fields).
  for (const [i,q] of m.chooseMeaningQuestions.entries()) h.context.record('chooseMeaning',i,{selected:q.answer,value:q.options[q.answer],correct:true,verdict:'correct'});
  h.context.renderMission();
  assert.equal((h.app.innerHTML.match(/class="question-card"/g)||[]).length,1);
  assert.match(h.app.innerHTML,/Hard mode/);
  await h.click('hard-mode',{section:'completePhrase',index:'0'});
  assert.match(h.app.innerHTML,/autocorrect="off"/);
  h.submit('completePhrase',0,'  UBER! ');
  assert.match(h.app.innerHTML,/Correct ✓/);
  await h.click('advance-item');
  await h.click('bank',{section:'completePhrase',index:'1',option:'1'}); // map, wrong
  await h.click('retry',{section:'completePhrase',index:'1'});
  await h.click('bank',{section:'completePhrase',index:'1',option:'0'}); // taxi, practice
  await h.click('advance-item');
  for (let i=2;i<m.completePhraseQuestions.length;i++) {
    h.submit('completePhrase',i,m.completePhraseQuestions[i].answers[0]); await h.click('advance-item');
  }
  h.submit('typeSentence',0,'w');
  assert.equal(vm.runInContext('state.answers.typeSentence[0]',h.context),undefined);
  for (const section of ['typeSentence','finalMission']) for(const [i,q] of m[section+'Questions'].entries()) {
    h.submit(section,i,q.answers[0].replaceAll('’',"'")); assert.match(h.app.innerHTML,/Correct ✓/); await h.click('advance-item');
  }
  await new Promise(done=>setTimeout(done,0));
  assert.equal(h.requests.length,1);
  const before=h.store.get('rtc:last:'+m.id), result=JSON.parse(before);
  assert.equal(result.totalScore,42);assert.equal(result.maxScore,43);
  assert.equal(result.completePhraseScore,11);
  assert.equal(JSON.parse(h.store.get(`rtc:progress:${m.id}:${m.missionVersion}`)).step,0);
  assert.match(h.app.innerHTML,/TRAIN WHAT I MISSED/);
  await h.click('review-missed');
  h.submit('completePhrase',1,'taxi'); await h.click('advance-item');
  assert.equal(h.store.get('rtc:last:'+m.id),before);
  assert.equal(h.requests.length,1);
  assert.equal(rewardSummary(JSON.parse(h.store.get('rtc:rewards:v1'))).completed,1);
  const reloaded=await appHarness([...h.store]);reloaded.context.location.hash='#result/'+m.id;reloaded.context.route();
  assert.match(reloaded.app.innerHTML,/Training already submitted/);
  assert.equal(reloaded.requests.length,0);
  assert.match(reloaded.app.innerHTML,/Copy Result/);
  await reloaded.click('copy');
  assert.equal(reloaded.clipboard[0],result.copiedResultText);
});

test('old result versions stay readable without training mismatched questions', async () => {
  const h=await appHarness(), m=missions.find(m=>m.id==='week-05-transportation');
  const r=buildResult(m,{...answered(m,false),repeat:[],listenedFullAudio:true,repeatedOutLoud:true},'test');
  r.missionVersion='v1';r.registrationStatus='registered';
  h.store.set('rtc:last:'+m.id,JSON.stringify(r));
  h.context.location.hash='#result/'+m.id;h.context.route();
  assert.doesNotMatch(h.app.innerHTML,/data-action="review-missed"/);
  assert.match(h.app.innerHTML,/My Last Result/);
  assert.equal(h.requests.length,0);
});

test('old partial progress resumes; phrase practice needs one confirmation and typed fallback survives', async () => {
  const h=await appHarness(), m=missions.find(m=>m.id==='week-05-transportation');
  h.store.set(`rtc:progress:${m.id}:${m.missionVersion}`,JSON.stringify({step:2,answers:{},repeat:[0,1],drafts:{}}));
  h.context.location.hash='#mission/'+m.id;h.context.route();
  assert.match(h.app.innerHTML,/3 \/ 16 phrases/);assert.match(h.app.innerHTML,/<summary>Show meaning/);
  await h.click('said');
  assert.deepEqual(JSON.parse(h.store.get(`rtc:progress:${m.id}:${m.missionVersion}`)).repeat,[0,1,2]);
  h.context.location.hash='#mission/week-04-food-ordering';h.context.route();
  vm.runInContext('state.step=4;renderMission()',h.context);
  assert.match(h.app.innerHTML,/<form id="answer-form"/);
  assert.doesNotMatch(h.app.innerHTML,/Hard mode/);
  h.submit('completePhrase',0,missions.find(m=>m.id==='week-04-food-ordering').completePhraseQuestions[0].answers[0]);assert.match(h.app.innerHTML,/Correct ✓/);
});

test('natural American voices outrank legacy voices, with a safe fallback', () => {
  const old = {name:'Microsoft David',lang:'en-US'};
  const natural = {name:'Microsoft Andrew Online (Natural)',lang:'en-US'};
  const google = {name:'Google US English',lang:'en-US'};
  assert.equal(preferredVoice([old,natural]),natural);
  assert.equal(preferredVoice([old,google]),google);
  assert.equal(preferredVoice([old]),old);
  assert.equal(preferredVoice([]),null);
});

test('chunks preserve accepted sentences, duplicate tokens and reject incomplete selections', () => {
  for (const mission of missions) for (const q of mission.typeSentenceQuestions) {
    const chunks=expressionChunks(q);
    if(chunks.length) assert.equal(evaluate(chunkAnswer(chunks,chunks.map((_,i)=>i)),q),'correct');
  }
  assert.equal(chunkAnswer(['I','need','help'],[0,1]),null);
  assert.equal(chunkAnswer(['I','need','help'],[0,0,1]),null);
  assert.equal(chunkAnswer(['go','go'],[0,1]),'go go');
  assert.deepEqual(expressionChunks({answers:['I need help.'],chunks:['Wrong','sentence']}),[]);
});

test('Build chunk retry keeps first score and resumes selected chunks', async () => {
  const h=await appHarness(), m=missions.find(m=>m.status==='current');
  h.context.location.hash='#mission/'+m.id;h.context.route();
  vm.runInContext('state.step=5;renderMission()',h.context);
  assert.match(h.app.innerHTML,/Check order/);
  const chunks=expressionChunks(m.typeSentenceQuestions[0]);
  for(let i=chunks.length-1;i>=0;i--) await h.click('add-chunk',{index:String(i)});
  await h.click('check-chunks');
  assert.match(h.app.innerHTML,/Correct version/);
  await h.click('retry',{section:'typeSentence',index:'0'});
  await h.click('add-chunk',{index:'0'});
  const reload=await appHarness([...h.store]);reload.context.location.hash='#mission/'+m.id;reload.context.route();
  assert.equal(vm.runInContext('state.chunkSelections.typeSentence0.length',reload.context),1);
  for(let i=1;i<chunks.length;i++) await reload.click('add-chunk',{index:String(i)});
  await reload.click('check-chunks');
  assert.match(reload.app.innerHTML,/Correct ✓/);
  assert.equal(vm.runInContext('state.answers.typeSentence[0].attempts[0].correct',reload.context),false);
  assert.equal(vm.runInContext('state.answers.typeSentence[0].attempts.length',reload.context),2);
});


test('audio checkbox persists independently and old typed answers remain visible', async () => {
  const h=await appHarness(), m=missions.find(m=>m.status==='current');
  h.context.location.hash='#mission/'+m.id;h.context.route();
  vm.runInContext('state.step=1;renderMission()',h.context);
  assert.match(h.app.innerHTML,/type="checkbox" id="listenedFullAudio"/);
  h.handlers.change({target:{id:'listenedFullAudio',checked:true}});
  assert.equal(vm.runInContext('state.listenedFullAudio',h.context),true);
  assert.equal(vm.runInContext('state.repeatedOutLoud',h.context),false);
  h.handlers.change({target:{id:'listenedFullAudio',checked:false}});
  assert.equal(vm.runInContext('state.listenedFullAudio',h.context),false);
  vm.runInContext('state.step=5;renderMission()',h.context);
  h.submit('typeSentence',0,m.typeSentenceQuestions[0].answers[0]);
  assert.match(h.app.innerHTML,/id="answer-form"/);
  assert.doesNotMatch(h.app.innerHTML,/Build your sentence here/);
});

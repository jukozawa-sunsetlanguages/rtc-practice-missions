/** Bind to the destination Sheet, run setup() once, then deploy as a Web App. */
var SHEET_NAME = 'RTC Lab Practice Logs';
var SPREADSHEET_PROPERTY = 'RTC_SPREADSHEET_ID';
var HEADERS = ['Timestamp', 'Student Name', 'Mission ID', 'Mission Name', 'Week', 'Mission Version', 'Status At Completion', 'Completed At', 'Total Score', 'Max Score', 'Percentage', 'Listened Full Audio', 'Repeated Out Loud', 'Difficult Audio Phrase', 'Listen Repeat Completed', 'Choose Meaning Score', 'Complete Phrase Score', 'Type Sentence Score', 'Final Mission Score', 'Difficult Phrases', 'Wrong Answers', 'Copied Result Text', 'User Agent'];

// Run from the Apps Script editor, where the bound spreadsheet is available.
// Web App requests use the stored ID instead of getActiveSpreadsheet().
function setup() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Open Extensions > Apps Script from the destination Google Sheet, then run setup.');
  PropertiesService.getScriptProperties().setProperty(SPREADSHEET_PROPERTY, book.getId());
  console.log('RTC Lab registration configured. Deploy this script as a Web App.');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var registrationToken = '';
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Missing JSON body');
    if (e.postData.contents.length > 100000) throw new Error('Payload too large');
    var data = JSON.parse(e.postData.contents);
    registrationToken = /^[a-f0-9]{32}$/.test(data && data.registrationToken) ? data.registrationToken : '';
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid JSON object');
    ['studentName', 'missionId', 'missionName', 'week', 'missionVersion', 'completedAt'].forEach(function (key) {
      if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error('Missing field: ' + key);
    });
    if (isNaN(Date.parse(data.completedAt))) throw new Error('Invalid completion date');
    if (['current', 'previous'].indexOf(data.statusAtCompletion) === -1) throw new Error('Invalid mission status');
    ['totalScore', 'maxScore', 'percentage', 'listenRepeatCompleted', 'chooseMeaningScore', 'completePhraseScore', 'typeSentenceScore', 'finalMissionScore'].forEach(function (key) {
      if (typeof data[key] !== 'number' || !isFinite(data[key]) || data[key] < 0) throw new Error('Invalid score: ' + key);
    });
    if (data.totalScore > data.maxScore || data.percentage > 100) throw new Error('Invalid score range');
    ['listenedFullAudio', 'repeatedOutLoud'].forEach(function (key) {
      if (typeof data[key] !== 'boolean') throw new Error('Invalid practice confirmation: ' + key);
    });
    if (!Array.isArray(data.difficultPhrases) || !Array.isArray(data.wrongAnswers)) throw new Error('Invalid practice details');
    lock.waitLock(20000);
    var spreadsheetId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_PROPERTY);
    if (!spreadsheetId) throw new Error('Run setup() in the Apps Script editor before using the Web App.');
    var book = SpreadsheetApp.openById(spreadsheetId);
    var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    } else {
      var existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
      if (existing.join('|') !== HEADERS.join('|')) throw new Error('Unexpected sheet headers; restore the expected columns');
    }
    // A retry of the same completion must not create a duplicate log.
    var count = sheet.getLastRow() - 1;
    if (count > 0) {
      var previous = sheet.getRange(2, 2, count, 7).getValues();
      var duplicate = previous.some(function (row) {
        var completedAt = row[6] instanceof Date ? row[6].toISOString() : String(row[6]);
        return row[0] === cell(data.studentName) && row[1] === cell(data.missionId) && row[4] === cell(data.missionVersion) && Date.parse(completedAt) === Date.parse(data.completedAt);
      });
      if (duplicate) { receipt(registrationToken, 'registered'); return json({ success: true }); }
    }
    var fields = ['studentName', 'missionId', 'missionName', 'week', 'missionVersion', 'statusAtCompletion', 'completedAt', 'totalScore', 'maxScore', 'percentage', 'listenedFullAudio', 'repeatedOutLoud', 'difficultAudioPhrase', 'listenRepeatCompleted', 'chooseMeaningScore', 'completePhraseScore', 'typeSentenceScore', 'finalMissionScore', 'difficultPhrases', 'wrongAnswers', 'copiedResultText', 'userAgent'];
    sheet.appendRow([new Date()].concat(fields.map(function (key) { return cell(data[key]); })));
    SpreadsheetApp.flush();
    receipt(registrationToken, 'registered');
    return json({ success: true });
  } catch (error) {
    console.error(error);
    receipt(registrationToken, 'error');
    return json({ success: false, error: String(error.message || error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

// Anonymous, short-lived receipt: no names, scores or spreadsheet rows exposed.
function receipt(token, status) {
  if (!token) return;
  try { CacheService.getScriptCache().put('receipt:' + token, status, 600); }
  catch (error) { console.error('Receipt unavailable: ' + error); }
}

// Optional manual fallback. Direct POST requires deployment access set to Anyone.
function doGet() {
  return HtmlService.createHtmlOutput(registrationPage_())
    .setTitle('RTC Lab — Register Training')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Called from the optional Google-hosted fallback via google.script.run.
// Reuse the same validation, lock, 23-column mapping and deduplication as doPost.
function registerAuthenticatedTraining(serialized) {
  if (typeof serialized !== 'string' || serialized.length > 100000) return { success: false, error: 'Invalid registration data' };
  return JSON.parse(doPost({ postData: { contents: serialized } }).getContent());
}

function registrationPage_() {
  return `<!doctype html><html lang="en"><head><base target="_top"><style>
  :root{color-scheme:dark;font-family:system-ui,sans-serif;background:#0a1726;color:#f2f0e9}*{box-sizing:border-box}body{margin:0;padding:24px}main{max-width:620px;margin:24px auto}header{color:#e8c568;font:12px monospace;letter-spacing:2px}h1{font-size:28px}p,li{line-height:1.6;color:#b4c1cf}section{padding:22px;border:1px solid #33485e;border-radius:16px;background:#101f30}label{display:block;margin-bottom:12px}textarea{width:100%;background:#0a1726;color:#f2f0e9;border:1px solid #52667c;border-radius:8px;padding:12px;font:16px monospace;resize:vertical}button{min-height:48px;padding:12px 20px;border:0;border-radius:8px;background:#e8b963;color:#152333;font-weight:700;cursor:pointer;margin:12px 0}button:disabled{opacity:.5;cursor:default}button:focus-visible,textarea:focus-visible{outline:3px solid #e8b963;outline-offset:3px}#preview{white-space:pre-wrap}#status{white-space:pre-wrap;color:#f2f0e9}small{display:block;line-height:1.6;color:#b4c1cf}
  </style></head><body><main><header>WORKSPEAK · RTC LAB</header><h1>Register Training</h1><p>Paste the registration data copied from your mission. Check the preview, then confirm.</p><section><form id="registration"><label for="payload">Registration data / Dados do treino</label><textarea id="payload" rows="7" maxlength="100000" required autocomplete="off" spellcheck="false" placeholder="Paste the data copied by Register Training…"></textarea><p id="preview" aria-live="polite"></p><button id="submit" type="submit" disabled>Register Training</button></form><p id="status" role="status" aria-live="polite"></p><small>After confirmation, return to RTC Lab. Repeating the same submission will not create a duplicate.</small></section></main><script>
  const form=document.getElementById('registration'), input=document.getElementById('payload'), button=document.getElementById('submit'), preview=document.getElementById('preview'), status=document.getElementById('status');
  let data=null, pending=false, timeout;
  input.addEventListener('input', function(){
    if(pending)return;
    data=null; button.disabled=true; preview.textContent=''; status.textContent='';
    if(!input.value.trim())return;
    try {
      const value=JSON.parse(input.value);
      if(!value || typeof value.studentName!=='string' || typeof value.missionName!=='string' || !Number.isFinite(value.totalScore) || !Number.isFinite(value.maxScore))throw Error('invalid');
      data=value;
      preview.textContent='Student: '+value.studentName+'\\nMission: '+value.week+' — '+value.missionName+'\\nScore: '+value.totalScore+' / '+value.maxScore;
      button.disabled=false;
    } catch(error){status.textContent='Please paste the registration data, not the WhatsApp summary. Return to the mission and click Copy registration data.';}
  });
  function failure(message){clearTimeout(timeout);pending=false;input.readOnly=false;button.disabled=false;button.textContent='Try again';status.textContent=message;}
  form.addEventListener('submit', function(event){
    event.preventDefault();if(pending || !data)return;
    pending=true;input.readOnly=true;button.disabled=true;button.textContent='Registering…';status.textContent='Saving your training…';
    timeout=setTimeout(function(){status.textContent='Still waiting for Google. Keep this tab open. If it does not finish, reload and paste the same data to retry safely.';},20000);
    google.script.run.withSuccessHandler(function(result){
      if(!result || result.success!==true){failure('I couldn’t register the training. Copy your result and send it to your teacher. '+(result && result.error ? 'Details: '+result.error : ''));return;}
      clearTimeout(timeout);pending=false;button.disabled=true;button.textContent='Training registered ✅';
      status.textContent='Training registered ✅ Good job, '+data.studentName+'. You can now return to RTC Lab.';
    }).withFailureHandler(function(){failure('I couldn’t register the training. Try again or copy your result and send it to your teacher.');}).registerAuthenticatedTraining(input.value);
  });
  </script></body></html>`;
}

function cell(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  var text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  // Store user text literally instead of allowing spreadsheet formulas.
  return /^[\s]*[=+@-]/.test(text) ? "'" + text : text;
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

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
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Missing JSON body');
    if (e.postData.contents.length > 100000) throw new Error('Payload too large');
    var data = JSON.parse(e.postData.contents);
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
        return row[0] === cell(data.studentName) && row[1] === cell(data.missionId) && row[4] === cell(data.missionVersion) && completedAt === data.completedAt;
      });
      if (duplicate) return json({ success: true });
    }
    var fields = ['studentName', 'missionId', 'missionName', 'week', 'missionVersion', 'statusAtCompletion', 'completedAt', 'totalScore', 'maxScore', 'percentage', 'listenedFullAudio', 'repeatedOutLoud', 'difficultAudioPhrase', 'listenRepeatCompleted', 'chooseMeaningScore', 'completePhraseScore', 'typeSentenceScore', 'finalMissionScore', 'difficultPhrases', 'wrongAnswers', 'copiedResultText', 'userAgent'];
    sheet.appendRow([new Date()].concat(fields.map(function (key) { return cell(data[key]); })));
    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ success: false, error: String(error.message || error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
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

export const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwCeaRB62wc_-v-kVG2uoesxG8w0UIeF5sOpdBB9TCzYDNrZA1uLG0Ibm80ne4qb8Q/exec';

export const REGISTRATION_ERROR = 'I couldn’t register the training automatically. Copy your result and send it to your teacher.';
const fields = ['studentName','missionId','missionName','week','missionVersion','statusAtCompletion','completedAt','totalScore','maxScore','percentage','listenedFullAudio','repeatedOutLoud','difficultAudioPhrase','listenRepeatCompleted','chooseMeaningScore','completePhraseScore','typeSentenceScore','finalMissionScore','difficultPhrases','wrongAnswers','copiedResultText','userAgent'];
function practiceList(value, field) {
  if (Array.isArray(value)) return value;
  if (value == null || value === '') return [];
  if (typeof value === 'string') {
    try { const parsed = JSON.parse(value); if (Array.isArray(parsed)) return parsed; } catch {}
    if (field === 'difficultPhrases') return [value];
  }
  throw new Error('Invalid saved ' + field + ': expected an array.');
}
export function registrationData(payload) {
  const result = Object.fromEntries(fields.map(key => [key, payload[key]]));
  result.difficultPhrases = practiceList(result.difficultPhrases, 'difficultPhrases');
  result.wrongAnswers = practiceList(result.wrongAnswers, 'wrongAnswers');
  return JSON.stringify(result);
}
export async function submitTrainingLog(payload) {
  const endpoint = SHEETS_WEB_APP_URL.trim();
  if (!endpoint) return { success: false, error: 'Registration URL not configured.' };
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) return { success: false, error: 'Invalid Apps Script /exec URL.' };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const body = registrationData(payload);
    console.debug('Submitting training log payload:', JSON.parse(body));
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body, signal: controller.signal, credentials: 'omit', redirect: 'follow'
    });
    console.debug('Apps Script response status:', response.status);
    const text = await response.text();
    console.debug('Apps Script response text:', text);
    let data;
    try { data = JSON.parse(text); }
    catch { console.error('Training registration failed: non-JSON response; check deployment access and /exec URL.'); return { success: false, error: 'Server did not return a JSON confirmation.' }; }
    console.debug('Apps Script parsed response:', data);
    if (!response.ok || data?.success !== true) {
      console.error('Training registration rejected:', response.status, data?.error || data);
      return { success: false, error: data?.error || 'Registration was not confirmed.' };
    }
    return { success: true };
  } catch (error) {
    console.error('Training registration failed:', error);
    return { success: false, error: error.name === 'AbortError' ? 'Registration timed out; retry safely.' : (error.message || 'Network error.') };
  } finally { clearTimeout(timer); }
}

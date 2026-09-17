export const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwCeaRB62wc_-v-kVG2uoesxG8w0UIeF5sOpdBB9TCzYDNrZA1uLG0Ibm80ne4qb8Q/exec';

export const REGISTRATION_ERROR = 'I couldn’t register the training automatically. Copy your result and send it to your teacher.';
const fields = ['studentName','missionId','missionName','week','missionVersion','statusAtCompletion','completedAt','totalScore','maxScore','percentage','listenedFullAudio','repeatedOutLoud','difficultAudioPhrase','listenRepeatCompleted','chooseMeaningScore','completePhraseScore','typeSentenceScore','finalMissionScore','difficultPhrases','wrongAnswers','copiedResultText','userAgent'];
export function registrationData(payload) {
  return JSON.stringify(Object.fromEntries(fields.map(key => [key, payload[key]])));
}
export async function submitTrainingLog(payload) {
  const endpoint = SHEETS_WEB_APP_URL.trim();
  if (!endpoint) return { success: false, error: 'Registration URL not configured.' };
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) return { success: false, error: 'Invalid Apps Script /exec URL.' };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: registrationData(payload), signal: controller.signal, credentials: 'omit', redirect: 'follow'
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch { return { success: false, error: 'Server did not return a JSON confirmation.' }; }
    if (!response.ok || data?.success !== true) return { success: false, error: data?.error || 'Registration was not confirmed.' };
    return { success: true };
  } catch (error) {
    return { success: false, error: error.name === 'AbortError' ? 'Registration timed out; retry safely.' : (error.message || 'Network error.') };
  } finally { clearTimeout(timer); }
}

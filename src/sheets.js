// Paste the deployed Google Apps Script /exec URL here. Leave empty to disable.
export const SHEETS_WEB_APP_URL = '';
const REGISTRATION_NOT_CONNECTED = 'Registration not connected yet. Copy your result and send it to your teacher.';
const REGISTRATION_FAILED = 'We could not confirm the submission. Copy your result or try again. Your progress is saved on this device.';

export async function registerTraining(payload) {
  const endpoint = SHEETS_WEB_APP_URL.trim();
  if (!endpoint) return { status: 'disconnected', message: REGISTRATION_NOT_CONNECTED };
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) {
    throw new Error('Registration is not configured correctly. Copy your result and send it to your teacher. The teacher should check the Apps Script /exec URL.');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    // text/plain carries JSON without a CORS preflight (Apps Script has no OPTIONS handler).
    // no-cors supports the Google redirect, but returns an opaque response: never claim confirmed storage.
    const response = await fetch(endpoint, {
      method: 'POST', mode: 'no-cors', credentials: 'omit', redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: controller.signal
    });
    // Opaque responses hide HTTP status. If a readable failure is provided,
    // do not present it as a successful submission.
    if (response.type !== 'opaque' && !response.ok) throw new Error('Registration request failed');
    return { status: 'sent', message: 'Training sent. This connection cannot confirm storage. Your teacher can check the sheet; you can also copy your result.' };
  } catch {
    throw new Error(REGISTRATION_FAILED);
  } finally { clearTimeout(timeout); }
}

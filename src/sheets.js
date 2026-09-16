// Paste the deployed Google Apps Script /exec URL here. Leave empty to disable.
export const SHEETS_WEB_APP_URL = '';

export async function registerTraining(payload) {
  if (!SHEETS_WEB_APP_URL.trim()) return { status: 'disconnected', message: 'Registration not connected yet. Copy your result and send it to your teacher.' };
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(SHEETS_WEB_APP_URL.trim())) {
    throw new Error('Check the Apps Script Web App URL. It must be a deployed https://script.google.com/macros/s/…/exec URL.');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    // text/plain carries JSON without a CORS preflight (Apps Script has no OPTIONS handler).
    // no-cors supports the Google redirect, but returns an opaque response: never claim confirmed storage.
    await fetch(SHEETS_WEB_APP_URL.trim(), {
      method: 'POST', mode: 'no-cors', credentials: 'omit', redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: controller.signal
    });
    return { status: 'sent', message: 'Training sent. This connection cannot confirm storage. Your teacher can check the sheet; you can also copy your result.' };
  } catch {
    throw new Error('We could not confirm the submission. Copy your result or try again. Your progress is saved on this device.');
  } finally { clearTimeout(timeout); }
}

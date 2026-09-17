// Keep the deployed Web App restricted to users with a Google account.
export const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwCeaRB62wc_-v-kVG2uoesxG8w0UIeF5sOpdBB9TCzYDNrZA1uLG0Ibm80ne4qb8Q/exec';

export function registrationData(payload) {
  const { registrationStatus, registrationMessage, ...result } = payload;
  return JSON.stringify(result);
}

export async function registerTraining(payload) {
  const endpoint = SHEETS_WEB_APP_URL.trim();
  if (!endpoint) return { status: 'disconnected', message: 'Registration not connected yet. Copy your result and send it to your teacher.' };
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) {
    throw new Error('Registration is not configured correctly. Copy your result and send it to your teacher. The teacher should check the Apps Script /exec URL.');
  }
  let copied = false;
  try { await navigator.clipboard.writeText(registrationData(payload)); copied = true; } catch { /* The UI provides selectable text. */ }
  return {
    status: 'awaiting-login',
    message: copied
      ? 'Registration data copied. Open Google Registration, sign in, paste the data, and confirm. Your training is not registered yet.'
      : 'Copy the registration data below. Open Google Registration, sign in, paste the data, and confirm. Your training is not registered yet.'
  };
}

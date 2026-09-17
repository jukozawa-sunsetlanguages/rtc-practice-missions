// Paste the deployed Google Apps Script /exec URL here. Leave empty to disable.
export const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwCeaRB62wc_-v-kVG2uoesxG8w0UIeF5sOpdBB9TCzYDNrZA1uLG0Ibm80ne4qb8Q/exec';
const REGISTRATION_NOT_CONNECTED = 'Registration not connected yet. Copy your result and send it to your teacher.';
const REGISTRATION_FAILED = 'I couldn’t register the training. Copy your result and send it to your teacher.';

function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('');
}

// Read only an anonymous receipt, never student data. A script callback can
// follow Google's redirect even when fetch cannot read a cross-origin response.
export function readReceipt(endpoint, token) {
  return new Promise(resolve => {
    const callback = 'rtcReceipt_' + randomToken();
    const script = document.createElement('script');
    let settled = false;
    const finish = status => {
      if (settled) return;
      settled = true; clearTimeout(timer); script.remove(); delete window[callback]; resolve(status);
    };
    const timer = setTimeout(() => finish('unknown'), 5000);
    window[callback] = result => finish(['registered', 'error', 'pending'].includes(result?.status) ? result.status : 'unknown');
    script.onerror = () => finish('unknown');
    script.src = `${endpoint}?receipt=${encodeURIComponent(token)}&callback=${callback}`;
    document.head.appendChild(script);
  });
}

export async function registerTraining(payload) {
  const endpoint = SHEETS_WEB_APP_URL.trim();
  if (!endpoint) return { status: 'disconnected', message: REGISTRATION_NOT_CONNECTED };
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) {
    throw new Error('Registration is not configured correctly. Copy your result and send it to your teacher. The teacher should check the Apps Script /exec URL.');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  const registrationToken = randomToken();
  try {
    // text/plain carries JSON without a CORS preflight (Apps Script has no OPTIONS handler).
    // no-cors supports the Google redirect, but returns an opaque response: never claim confirmed storage.
    const response = await fetch(endpoint, {
      method: 'POST', mode: 'no-cors', credentials: 'omit', redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ ...payload, registrationToken }), signal: controller.signal
    });
    // Opaque responses hide HTTP status. If a readable failure is provided,
    // do not present it as a successful submission.
    if (response.type !== 'opaque' && !response.ok) throw new Error('Registration request failed');
    clearTimeout(timeout);
    for (let attempt = 0; attempt < 4; attempt++) {
      const status = await readReceipt(endpoint, registrationToken);
      if (status === 'registered') return { status: 'registered', message: `Training registered ✅ Good job, ${payload.studentName}.` };
      if (status === 'error') throw new Error('The receiver rejected the registration');
      if (status === 'unknown') break;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return { status: 'sent', message: 'Training sent, but registration could not be confirmed. Copy your result and send it to your teacher, or try registration again.' };
  } catch {
    throw new Error(REGISTRATION_FAILED);
  } finally { clearTimeout(timeout); }
}

export const speechRates = { slow: 0.75, normal: 1, fast: 1.2 };

// SpeechSynthesisVoice has no gender field. Prefer known American male voices.
export function preferredVoice(voices) {
  const american = voices.filter(voice => /^en[-_]US$/i.test(voice.lang));
  // Prefer enhanced voices before legacy system voices such as Microsoft David.
  const natural = voice => /natural|neural|enhanced|premium|online/i.test(voice.name);
  const male = voice => /\b(Guy|Christopher|Andrew|Brian|Davis|Tony|Jason|Alex|Tom|Aaron|Evan|Nathan|Joey|Matthew)\b/i.test(voice.name);
  return american.find(voice => natural(voice) && male(voice))
    || american.find(natural)
    || american.find(voice => /google/i.test(voice.name))
    || american.find(male)
    || american[0] || voices.find(voice => /^en[-_]/i.test(voice.lang)) || null;
}

export function speechSegments(text) {
  return text.split(/(\[pause\])/i).flatMap(part => /^\[pause\]$/i.test(part)
    ? [{ pause: 3000 }]
    : (part.match(/[^.!?]+[.!?]*/g) || []).map(text => ({ text: text.trim() })).filter(item => item.text));
}
export function estimatedSeconds(text, rate) {
  return speechSegments(text).reduce((seconds, item) => seconds + (item.pause ? item.pause / 1000 : item.text.split(/\s+/).length / (150 * rate / 60) + 0.25), 0);
}
export function timestamp(seconds) {
  const rounded = Math.round(seconds);
  return Math.floor(rounded / 60) + ':' + String(rounded % 60).padStart(2, '0');
}

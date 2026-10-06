import { acceptedAnswers, evaluate } from './scoring.js';

// Contiguous chunks preserve contractions and punctuation. Explicit teacher
// chunks take precedence; malformed content falls back to the typed exercise.
export function expressionChunks(question) {
  const expected = acceptedAnswers(question)[0] || '';
  const words = expected.trim().split(/\s+/);
  const chunks = question.chunks || (words.length > 3
    ? words.reduce((parts, word, i) => { if (i % 2 === 0) parts.push(word); else parts[parts.length - 1] += ' ' + word; return parts; }, [])
    : words);
  return Array.isArray(chunks) && chunks.length > 1 && chunks.every(c => typeof c === 'string' && c.trim()) && evaluate(chunks.join(' '), question) === 'correct' ? chunks : [];
}
export function chunkAnswer(chunks, selected) {
  if (selected.length !== chunks.length || new Set(selected).size !== chunks.length || selected.some(i => !Number.isInteger(i) || i < 0 || i >= chunks.length)) return null;
  return selected.map(i => chunks[i]).join(' ');
}

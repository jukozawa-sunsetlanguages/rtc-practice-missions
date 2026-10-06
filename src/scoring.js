export const questionSections = ['chooseMeaning', 'completePhrase', 'typeSentence', 'finalMission'];
export function normalize(value) {
  return String(value ?? '').normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[.,!?;:]/g, '').trim().replace(/\s+/g, ' ');
}
export function acceptedAnswers(question) {
  if (Array.isArray(question)) return question;
  return [...new Set([question.expectedAnswer, ...(question.answers || []), ...(question.acceptedAnswers || [])].filter(a => typeof a === 'string' && a.trim()))];
}
export function itemId(mission, section, question, index) {
  return `${mission.id}:${section}:${question.id ?? index}`;
}
export function reviewItems(mission, wrongAnswers = []) {
  if (!Array.isArray(wrongAnswers)) return [];
  const seen = new Set();
  return wrongAnswers.filter(a => (a.attemptNumber ?? 1) === 1).flatMap(a => {
    const questions = mission[a.section + 'Questions'];
    const index = a.itemId ? questions?.findIndex((q, i) => itemId(mission, a.section, q, i) === a.itemId) : a.questionIndex;
    const q = questions?.[index];
    if (!q) return [];
    const phrase = a.section === 'chooseMeaning' ? q.practicePhrase || q.prompt : q.fullPhrase || acceptedAnswers(q)[0];
    const identity = normalize(phrase);
    if (!identity || seen.has(identity)) return [];
    seen.add(identity);
    return [{ id: itemId(mission, a.section, q, index), section: a.section, index, phrase }];
  });
}
export function uniquePhrases(phrases = []) {
  const seen = new Set();
  return phrases.filter(p => { const n = normalize(p); if (!n || seen.has(n)) return false; seen.add(n); return true; });
}
function distance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
}
export function evaluate(value, answers) {
  answers = acceptedAnswers(answers);
  const text = normalize(value);
  if (answers.some(answer => normalize(answer) === text)) return 'correct';
  return answers.some(answer => {
    const expected = normalize(answer);
    return text.length > 3 && distance(text, expected) / Math.max(text.length, expected.length) <= 0.18;
  }) ? 'almost' : 'incorrect';
}
export function summarize(mission, state) {
  const scores = Object.fromEntries(questionSections.map(section => [section + 'Score',
    mission[section + 'Questions'].reduce((score, _, i) => {
      const answer = state.answers[section]?.[i];
      return score + ((answer?.attempts?.[0] || answer)?.correct ? 1 : 0);
    }, 0)]));
  const maxScore = questionSections.reduce((sum, section) => sum + mission[section + 'Questions'].length, 0);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const wrongAnswers = questionSections.flatMap(section => mission[section + 'Questions'].flatMap((q, i) => {
    const attempt = state.answers[section]?.[i];
    const attempts = attempt ? attempt.attempts || [attempt] : [];
    return attempts.flatMap((item, attemptIndex) => !item.correct ? [{ section, questionIndex: i, itemId: itemId(mission, section, q, i), attemptNumber: attemptIndex + 1, verdict: item.verdict || 'incorrect', prompt: q.prompt, answer: item.value, expected: q.fullPhrase || acceptedAnswers(q)[0] || q.options[q.answer] }] : []);
  }));
  const difficultPhrases = reviewItems(mission, wrongAnswers).map(item => item.phrase);
  const answerSummary = { correct: 0, almost: 0, incorrect: 0 };
  for (const section of questionSections) {
    mission[section + 'Questions'].forEach((_, i) => {
      const answer = state.answers[section]?.[i];
      const first = answer?.attempts?.[0] || answer;
      if (first) answerSummary[first.verdict || (first.correct ? 'correct' : 'incorrect')]++;
    });
  }
  return { ...scores, maxScore, totalScore, percentage: maxScore ? Math.round(totalScore / maxScore * 100) : 0, wrongAnswers, difficultPhrases, answerSummary };
}

export const questionSections = ['chooseMeaning', 'completePhrase', 'typeSentence', 'finalMission'];
export function normalize(value) {
  return String(value).normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?;:]/g, '').trim().replace(/\s+/g, ' ');
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
  const text = normalize(value);
  if (answers.some(answer => normalize(answer) === text)) return 'correct';
  return answers.some(answer => {
    const expected = normalize(answer);
    return text.length > 3 && distance(text, expected) / Math.max(text.length, expected.length) <= 0.18;
  }) ? 'almost' : 'incorrect';
}
export function summarize(mission, state) {
  const scores = Object.fromEntries(questionSections.map(section => [section + 'Score',
    mission[section + 'Questions'].reduce((score, _, i) => score + (state.answers[section]?.[i]?.correct ? 1 : 0), 0)]));
  const maxScore = questionSections.reduce((sum, section) => sum + mission[section + 'Questions'].length, 0);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const wrongAnswers = questionSections.flatMap(section => mission[section + 'Questions'].flatMap((q, i) => {
    const attempt = state.answers[section]?.[i];
    return attempt && !attempt.correct ? [{ section, prompt: q.prompt, answer: attempt.value, expected: q.fullPhrase || q.answers?.[0] || q.options[q.answer] }] : [];
  }));
  const difficultPhrases = [...new Set([
    ...(state.difficultAudioPhrase.trim() ? [state.difficultAudioPhrase.trim()] : []),
    ...wrongAnswers.map(answer => {
      const q = mission[answer.section + 'Questions'].find(q => q.prompt === answer.prompt);
      return answer.section === 'chooseMeaning' ? q.prompt : answer.expected;
    })
  ])];
  return { ...scores, maxScore, totalScore, percentage: maxScore ? Math.round(totalScore / maxScore * 100) : 0, wrongAnswers, difficultPhrases };
}

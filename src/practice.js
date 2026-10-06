// Presentation only: the seven persisted internal steps keep their original IDs.
export const phases = [
  { number: 1, name: 'Briefing', part: 'About 10 sec' },
  { number: 2, name: 'Hear & Repeat', part: 'Part A · Full Audio' },
  { number: 2, name: 'Hear & Repeat', part: 'Part B · Phrase Practice' },
  { number: 3, name: 'Recognize', part: 'Choose the Meaning' },
  { number: 4, name: 'Build', part: 'Part A · Complete the Phrase' },
  { number: 4, name: 'Build', part: 'Part B · Type the Sentence' },
  { number: 5, name: 'Final Mission', part: 'Final round' }
];
export function shuffledIndices(length, random = Math.random) {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
export function stars(percentage) { return percentage >= 85 ? 3 : percentage >= 60 ? 2 : 1; }
export function starText(percentage) { const n = stars(percentage); return '★'.repeat(n) + '☆'.repeat(3 - n); }
export function completionFeedback(percentage) {
  return percentage >= 85 ? 'Strong result. You handled this mission well.' : percentage >= 60 ? 'Good progress. A few phrases need another round.' : "Mission completed. Let's train the phrases that gave you trouble.";
}
// Kept separate from the result payload and registration. Completion identity is
// also the reward identity, so opening/reloading a result never grants XP twice.
export function addReward(ledger, result) {
  const id = JSON.stringify([result.missionId, result.missionVersion, result.completedAt]);
  if (ledger[id]) return ledger;
  return { ...ledger, [id]: { missionId: result.missionId, xp: 7 * 10 + result.totalScore * 5 + 20, stars: stars(result.percentage) } };
}
export function rewardSummary(ledger) {
  const entries = Object.values(ledger);
  return { xp: entries.reduce((sum, r) => sum + r.xp, 0), completed: entries.length };
}

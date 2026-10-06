const sections = ['chooseMeaning', 'completePhrase', 'typeSentence', 'finalMission'];
export function practiceXP(mission, state) {
  const done = [state.step > 0 || state.started || state.repeat.length > 0 || sections.some(s => Object.keys(state.answers[s] || {}).length), state.listenedFullAudio && state.repeatedOutLoud,
    mission.targetPhrases.every((_, i) => state.repeat.includes(i)),
    ...sections.map(s => mission[s + 'Questions'].every((_, i) => state.answers[s]?.[i]))];
  const correct = sections.reduce((sum, s) => sum + mission[s + 'Questions'].filter((_, i) => {
    const a = state.answers[s]?.[i]; return (a?.attempts?.[0] || a)?.correct;
  }).length, 0);
  return done.filter(Boolean).length * 10 + correct * 5;
}
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function dailySummary(log, now = new Date()) {
  const today = localDay(now), count = (log[today] || []).length;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  if (!count) cursor.setDate(cursor.getDate()-1);
  let streak = 0;
  while ((log[localDay(cursor)] || []).length) { streak++; cursor.setDate(cursor.getDate()-1); }
  return { count, streak, days: Object.values(log).filter(items => items.length).length };
}

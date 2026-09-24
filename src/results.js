import { missionLabel } from './labels.js';
import { questionSections, summarize } from './scoring.js';

export function localISO(date = new Date()) {
  const minutes = -date.getTimezoneOffset();
  const shifted = new Date(date.getTime() + minutes * 60000);
  const offset = `${minutes >= 0 ? '+' : '-'}${String(Math.floor(Math.abs(minutes) / 60)).padStart(2, '0')}:${String(Math.abs(minutes) % 60).padStart(2, '0')}`;
  return shifted.toISOString().slice(0, -1) + offset;
}

export function resultText(result) {
  return `RTC Lab Practice Mission completed ✅\n\nStudent: ${result.studentName}\nMission: ${missionLabel(result.week)} — ${result.missionName}\nScore: ${result.totalScore} / ${result.maxScore} (${result.percentage}%)\n\nI practiced:\n${result.practicedPhrases.map(p => '- ' + p).join('\n')}\n\nDifficult phrases:\n${result.difficultPhrases.length ? result.difficultPhrases.map(p => '- ' + p).join('\n') : 'None reported'}\n\nSend this result to your teacher on WhatsApp.`;
}

export function buildResult(mission, state, userAgent, date = new Date()) {
  const summary = summarize(mission, state);
  const answered = questionSections.reduce((n, section) => n + mission[section + 'Questions'].filter((_, i) => state.answers[section]?.[i]).length, 0);
  const practicedPhrases = mission.targetPhrases.filter((_, i) => state.repeat.includes(i)).map(p => p.english);
  const result = {
    studentName: mission.studentName, missionId: mission.id, missionName: mission.title,
    week: mission.week, missionVersion: mission.missionVersion, statusAtCompletion: mission.status,
    completedAt: localISO(date), ...summary, listenedFullAudio: state.listenedFullAudio,
    repeatedOutLoud: state.repeatedOutLoud, difficultAudioPhrase: state.difficultAudioPhrase,
    listenRepeatCompleted: practicedPhrases.length, practicedPhrases,
    completedItems: answered + practicedPhrases.length + Number(state.listenedFullAudio) + Number(state.repeatedOutLoud),
    sectionTotals: Object.fromEntries(questionSections.map(s => [s, mission[s + 'Questions'].length])), userAgent
  };
  result.copiedResultText = resultText(result);
  return result;
}

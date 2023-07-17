export type Level = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'ruby' | 'master';

// 0 ~ 5000 브론즈
// 5000 ~ 10000 실버
// 10000 ~ 15000 골드
// 15000 ~ 20000 플레티넘
// 20000 ~ 25000 다이아
// 25000 ~ 30000 루비
// 30000 ~       마스터

//

export function levelFromLevelScore(levelScore: number): { level: Level; grade: number } {
  const calcGrade = (score: number) => Math.floor(score / 1000) + 1;
  if (levelScore < 5000) return { level: 'bronze', grade: calcGrade(levelScore) };
  if (levelScore < 10000) return { level: 'silver', grade: calcGrade(levelScore - 5000) };
  if (levelScore < 15000) return { level: 'gold', grade: calcGrade(levelScore - 10000) };
  if (levelScore < 20000) return { level: 'platinum', grade: calcGrade(levelScore - 15000) };
  if (levelScore < 25000) return { level: 'diamond', grade: calcGrade(levelScore - 20000) };
  if (levelScore < 30000) return { level: 'ruby', grade: calcGrade(levelScore - 25000) };
  return { level: 'master', grade: 5 }; // 마스터 등급은 1~5가 없음
}

export const levelColor: { [key: string]: string } = {
  Bronze: '',
};

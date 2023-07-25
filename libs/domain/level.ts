export type Level = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'ruby' | 'master';

// 0 ~ 5000 브론즈
// 5000 ~ 10000 실버
// 10000 ~ 15000 골드
// 15000 ~ 20000 플레티넘
// 20000 ~ 25000 다이아
// 25000 ~ 30000 루비
// 30000 ~       마스터

//
// 브론즈 - 바둑 교실에 다니는 1년 이내 어린이들도 충분히 풀 수 있는 난이도 (사활 시리즈 1~3)
// 실버 - 타이젬 1~5급, 교실 2~3년차 어린이들이 풀 정도의 난이도 (사활 시리즈 4)
// 골드 - 타이젬 1~5단 (현현기경, 기경중묘)

export const levelRange = {
  bronze: { from: 0, to: 4999 },
  silver: { from: 5000, to: 9999 },
  gold: { from: 10000, to: 14999 },
  platinum: { from: 15000, to: 19999 },
  diamond: { from: 20000, to: 24999 },
  ruby: { from: 25000, to: 29999 },
  master: { from: 30000, to: 10000000 },
};

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

// level -> levelScore
// grade는 1로 통일
export function levelToLevelScore(level: Level): number {
  if (level === 'bronze') {
    return 2500;
  }
  if (level === 'silver') {
    return 7500;
  }
  if (level === 'gold') {
    return 12500;
  }
  if (level === 'platinum') {
    return 17500;
  }
  if (level === 'diamond') {
    return 22500;
  }
  if (level === 'ruby') {
    return 27500;
  }
  return 30000;
}

export const levelColor: { [key: string]: string } = {
  Bronze: '',
};

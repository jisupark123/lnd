import { StoneColor } from '@/libs/domain/baduk/baduk';
import { Level } from '@/libs/domain/level';

export type ProblemType = '사활' | '맥';
export type ProblemResult = '살리는 문제' | '죽이는 문제' | '패';

export interface ProblemFormat {
  dimensions: number; // 몇줄 바둑판
  firstTurn: StoneColor; // 흑선 or 백선
  shape: Move[]; // 문제 형태
  correctAnswers: Move[][]; // 정답
  wrongAnswers: Move[][] | null; // 오답
  // variations?: {
  //   // 변화도
  // };
}

interface Coordinate {
  x: number;
  y: number;
}

export interface Move extends Coordinate {
  stoneColor: StoneColor;
}

export type ProblemInfo = {
  id: number;
  level: Level;
  levelScore: number;
  createdAt: Date;
  createdUserId: number | null;
  createdUserProfile: string | null;
  answerCount: number;
  answerRate: string;
  userSolved: boolean;
};

export type ProblemOrderType = 'recent' | 'acceptance_desc' | 'acceptance_asc';

import { StoneColor } from '@/libs/domain/baduk/baduk';

export interface ProblemFormat {
  dimensions: number; // 몇줄 바둑판
  firstTurn: StoneColor; // 흑선 or 백선
  shape: Move[]; // 문제 형태
  correctAnswers: Move[][]; // 정답
  wrongAnswers?: Move[][]; // 오답
  variations?: {
    // 변화도
  };
}

interface Coordinate {
  x: number;
  y: number;
}

interface Move extends Coordinate {
  stoneColor: StoneColor;
}

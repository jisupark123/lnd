import { StoneColor, oppositeStoneColor } from './baduk';
// 바둑에 대한 여러가지 도구를 제공하는 클래스
// 패에 대한 처리도 포함된다.
// 각각의 수마다 Scene을 생성해서 리스트로 관리한다.
// N수 전(후)으로 이동하는 기능을 위해서 head 프로퍼티를 추가했다.

import { List, Record } from 'immutable';
import {
  BLACK,
  Board,
  Move,
  Scene,
  WHITE,
  addMoveToBoard,
  getDeadStonesCount,
  makeScenesByMoves,
  oppositeColor,
} from './baduk';

// head가 가리키는 scene이 유저에게 보여줄 장면이다.
export class Basis extends Record({ dimensions: 19, scenes: List<Scene>(), nextTurn: 'BLACK' as StoneColor }, 'Basis') {
  constructor({
    dimensions,
    basicBoard,
    moves,
    nextTurn,
  }: {
    dimensions: number;
    basicBoard?: Board; // 처음 상태의 board
    moves?: Move[];
    nextTurn?: StoneColor; // 처음에 누가 먼저 두는지
  }) {
    const _basicBoard = basicBoard ?? new Board(dimensions);
    const scenes = moves ? makeScenesByMoves(_basicBoard, ...moves) : List<Scene>([new Scene(_basicBoard)]);
    const lastScene = scenes.last()!;

    // 1. nextTurn 값을 받았다면 -> nextTurn
    // 2. 값을 안받았다면,
    // 2-1. 마지막 Scene에 newMove가 없다면(moves 입력 X) -> basicBoard에 돌이 있다면(접바둑으로 간주) White, 아니면 Black
    // 2-2. 마지막 Scene에 newMove가 있다면(moves 입력 O) -> oppositeColor
    const _nextTurn =
      nextTurn !== undefined
        ? nextTurn
        : lastScene.newMove === null
        ? lastScene.board.moves.size
          ? WHITE
          : BLACK
        : oppositeColor(lastScene.newMove.color);

    super({
      dimensions,
      scenes,
      nextTurn: _nextTurn as StoneColor,
    });
  }
}

export const basisToolkit = {
  /*
  basis 클래스에 새로운 돌을 추가하는 함수

  1. 새로운 수를 추가한 바둑판(newBoard)을 생성한다. 
  2. 패에 대한 처리를 위해 newBoard와 두 수 전의 바둑판을 비교한다. (만약 같다면 에러 반환)
  3. 새로운 Snene이 추가된 Basis를 반환한다.
  */
  addMove(basis: Basis, move: Move) {
    const newBoard = addMoveToBoard(basis.scenes.last()!.board, move);
    const boardBeforeTwoTurn = basis.scenes.get(basis.scenes.size - 2)?.board;
    if (boardBeforeTwoTurn && boardBeforeTwoTurn.equals(newBoard)) {
      throw new Error(`팻감을 쓰지 않고 패를 따낼 수 없습니다. x:${move.coordinate.x} y:${move.coordinate.y}`);
    }

    return basis
      .set('scenes', basis.scenes.push(new Scene(newBoard, move)))
      .set('nextTurn', oppositeStoneColor(basis.nextTurn));
  },

  // addMove에 실패하면 에러 대신 원래 참조를 반환하는 함수
  addMoveWithoutError(basis: Basis, move: Move): Basis {
    try {
      return this.addMove(basis, move);
    } catch {
      return basis;
    }
  },

  // 유저에게 보여줄 장면 & 정보를 가져오는 함수
  currentScene(basis: Basis) {
    const scene = basis.scenes.last()!;
    const sequences = this.getSequences(basis);
    const currMove = scene.newMove;

    const totalMoveCount = sequences.size;
    const deadStonesCount = getDeadStonesCount(scene.board, totalMoveCount);
    return { board: scene.board, sequences, currMove, nextTurn: basis.nextTurn, deadStonesCount };
  },

  // 모든 수순을 리스트로 반환한다. (수순보기 기능)
  getSequences(basis: Basis): List<Move> {
    return basis.scenes.map((scene) => scene.newMove).filter((move) => move !== null) as List<Move>;
  },
};

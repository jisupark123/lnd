import { List, Record } from 'immutable';
import { Board, Color, Coordinate, Move, Scene, StoneColor, makeScenesByMoves } from './baduk';
import * as format from '@/types/problem';
import { Basis } from './basis';

export class Problem extends Record({
  dimensions: 19,
  shape: new Board(19),
  firstTurn: 'BLACK' as StoneColor,
  correctAnswers: List<List<Scene>>(),
  wrongAnswers: List<List<Scene>>(),
}) {
  constructor({
    dimensions,
    shape,
    firstTurn,
    correctAnswers,
    wrongAnswers,
  }: {
    dimensions: number;
    shape: Move[];
    firstTurn: StoneColor;
    correctAnswers: Move[][];
    wrongAnswers?: Move[][];
  }) {
    const boardShape = new Board(dimensions, ...shape);
    super({
      dimensions,
      shape: boardShape,
      firstTurn,
      correctAnswers: List(correctAnswers).map((moves) => makeScenesByMoves(boardShape, ...moves).slice(1)),
      wrongAnswers: !wrongAnswers
        ? List<List<Scene>>()
        : List(wrongAnswers).map((moves) => makeScenesByMoves(boardShape, ...moves).slice(1)),
    });
  }
}

export const problemToolkit = {
  /*
  사용자가 놓은 돌이 보유한 정답도/실패도에 있는지 체크하는 함수
  */
  isInAnswers(problem: Problem, basis: Basis) {
    const { board } = basis.scenes.last()!;
    const curr_order = basis.scenes.size - 1; // 몇번째 수인지
    return (
      problem.correctAnswers
        .concat(problem.wrongAnswers)
        .map((answer) => answer.get(curr_order - 1))
        .find((scene) => scene?.board.equals(board) === true) !== undefined
    );
  },

  /*
  사용자가 돌을 놓으면, 먼저 바둑판에 보여준다.
  돌이 놓인 상태로 함수를 호출한다. -> 전달 받은 board의 마지막 수는 무조건 사용자가 둔 수다.

  경우의 수
  1. 전달 받은 board가 정답도의 마지막 부분과 일치한다. -> success, 정답 알림 띄우기
  2. 실패도의 마지막은 사용자일 수 없기 때문에 실패도의 마지막과 일치할 수는 없다.
  3. 전달 받은 board가 정답도의 마지막 -1 부분과 일치한다. -> nextSuccess, 응수 후 정답 알림 띄우기
  4. 전달 받은 board가 실패도의 마지막 -1 부분과 일치한다. -> failure, 응수 후 실패 알림 띄우기
  5. 정답도나 실패도의 중간 부분과 일치한다. -> progress, 응수하기
  */
  getResponse(
    problem: Problem,
    basis: Basis,
  ): { status: 'success' | 'nextSuccess' | 'failure' | 'progress'; nextMove: Move | null } {
    const { board } = basis.scenes.last()!;
    const curr_order = basis.scenes.size - 2; // 몇번째 수인지

    // 전달 받은 board가 정답도의 마지막 부분과 일치한다.
    const isSuccessed =
      problem.correctAnswers.find((answer) => answer.last()?.board.equals(board) || false) !== undefined;
    if (isSuccessed) {
      return { status: 'success', nextMove: null };
    }

    // 전달 받은 board가 정답도의 마지막 -1 부분과 일치한다.
    const lastMoveInCorrect = problem.correctAnswers
      .find((answer) => answer.size - 2 === curr_order && answer.get(answer.size - 2)?.board.equals(board) === true)
      ?.last()?.newMove;

    if (lastMoveInCorrect) {
      return {
        status: 'nextSuccess',
        nextMove: lastMoveInCorrect,
      };
    }

    // 전달 받은 board가 실패도의 마지막 -1 부분과 일치한다.
    const lastMoveInWrong = problem.wrongAnswers
      .find((answer) => answer.size - 2 === curr_order && answer.get(answer.size - 2)?.board.equals(board) === true)
      ?.last()?.newMove;

    if (lastMoveInWrong) {
      return {
        status: 'failure',
        nextMove: lastMoveInWrong,
      };
    }

    // 정답도나 실패도의 중간 부분과 일치한다. (이미 isInAnswers 함수로 검증받고 넘어오기 때문에 정답도나 실패도와 무조건 일치한다)
    const nextMove = problem.correctAnswers
      .concat(problem.wrongAnswers)
      .find((answer) => answer.get(curr_order)?.board.equals(board) === true)
      ?.get(curr_order + 1)?.newMove!;

    return { status: 'progress', nextMove };
  },

  // Board의 모든 Move들을 Format의 Move 객체들로 변환
  // 순서는 보장 X
  boardToFormatMoves(board: Board): format.Move[] {
    return board.moves
      .keySeq()
      .toArray()
      .map((coordinate) => ({
        x: coordinate.x,
        y: coordinate.y,
        stoneColor: board.moves.get(coordinate) as StoneColor,
      }));
  },
  scenesToFormatMoves(scenes: List<Scene>): format.Move[] {
    return scenes
      .map((scene) => ({
        x: scene.newMove!.coordinate.x,
        y: scene.newMove!.coordinate.y,
        stoneColor: scene.newMove!.color as StoneColor,
      }))
      .toArray();
  },

  // database의 format을 Problem 클래스로 변환
  formatToProblem(format: format.ProblemFormat): Problem {
    return new Problem({
      dimensions: format.dimensions,
      shape: format.shape.map((move) => new Move(new Coordinate(move.x, move.y), move.stoneColor as Color)),
      firstTurn: format.firstTurn,
      correctAnswers: format.correctAnswers.map((lst) =>
        lst.map((move) => new Move(new Coordinate(move.x, move.y), move.stoneColor as Color)),
      ),
      wrongAnswers: format.wrongAnswers?.map((lst) =>
        lst.map((move) => new Move(new Coordinate(move.x, move.y), move.stoneColor as Color)),
      ),
    });
  },

  // Problem 클래스를 format으로 변환
  problemToFormat(problem: Problem): format.ProblemFormat {
    const { dimensions, shape, firstTurn, correctAnswers, wrongAnswers } = problem;

    const correctAnswersFormat = correctAnswers
      .map((answer) =>
        answer
          .map((scene) => {
            const { newMove } = scene;
            const move: { x: number; y: number; stoneColor: StoneColor } = {
              x: scene.newMove!.coordinate.x,
              y: scene.newMove!.coordinate.y,
              stoneColor: scene.newMove!.color as StoneColor,
            };
            return move;
          })
          .toArray(),
      )
      .toArray();
    const wrongAnswersFormat = wrongAnswers
      .map((answer) =>
        answer
          .map((scene) => {
            const { newMove } = scene;
            const move: { x: number; y: number; stoneColor: StoneColor } = {
              x: scene.newMove!.coordinate.x,
              y: scene.newMove!.coordinate.y,
              stoneColor: scene.newMove!.color as StoneColor,
            };
            return move;
          })
          .toArray(),
      )
      .toArray();
    return {
      dimensions,
      firstTurn,
      shape: problemToolkit.boardToFormatMoves(shape),
      correctAnswers: correctAnswersFormat,
      wrongAnswers: wrongAnswersFormat,
    };
  },
};

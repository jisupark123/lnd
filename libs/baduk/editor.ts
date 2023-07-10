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
  StoneColor,
  WHITE,
  addMoveToBoard,
  getDeadStonesCount,
  makeScenesByMoves,
  oppositeColor,
  oppositeStoneColor,
} from './baduk';

type ChangeTurnMode = 'auto' | 'manual';

// head가 가리키는 scene이 유저에게 보여줄 장면이다.
export class Editor extends Record(
  {
    dimensions: 19,
    scenes: List<Scene>(),
    head: 0,
    nextTurn: 'BLACK' as StoneColor,
    changeTurnMode: 'auto' as ChangeTurnMode,
  },
  'Editor'
) {
  constructor({
    dimensions,
    basicBoard,
    moves,
    nextTurn,
    changeTurnMode,
  }: {
    dimensions: number;
    basicBoard?: Board;
    moves?: Move[];
    nextTurn?: StoneColor; // 처음에 누가 먼저 두는지
    changeTurnMode?: ChangeTurnMode; // turn
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
      head: scenes.size - 1,
      nextTurn: _nextTurn as StoneColor,
      changeTurnMode: changeTurnMode ?? 'auto',
    });
  }
}

export const editorToolkit = {
  /*
    Editor 클래스에 새로운 돌을 추가하는 함수

    1. head가 위치한 바둑판에 새로운 수를 추가한 바둑판(newBoard)을 생성한다. 
    2. 패에 대한 처리를 위해 newBoard와 두 수 전의 바둑판을 비교한다. (만약 같다면 에러 반환)
    3. 만약 newBoard가 다음 head에 위치한 바둑판과 같다면 
      head에 1만 추가한 Editor을, 
      다르다면 head 이후의 Scene들을 삭제하고 newBoard를 추가한 Editor을 리턴한다.
  */
  addMove(editor: Editor, move: Move): Editor {
    const newBoard = addMoveToBoard(editor.scenes.get(editor.head)!.board, move);
    const boardBeforeTwoTurn = editor.scenes.get(editor.head - 1)?.board;
    if (boardBeforeTwoTurn && boardBeforeTwoTurn.equals(newBoard)) {
      throw new Error(`팻감을 쓰지 않고 패를 따낼 수 없습니다. x:${move.coordinate.x} y:${move.coordinate.y}`);
    }

    const boardAfterOneTurn = editor.scenes.get(editor.head + 1)?.board;

    if (boardAfterOneTurn && boardAfterOneTurn.equals(newBoard)) {
      return editor.set('head', editor.head + 1);
    }

    return editor
      .set('scenes', editor.scenes.slice(0, editor.head + 1).push(new Scene(newBoard, move)))
      .set('head', editor.head + 1)
      .set('nextTurn', editor.changeTurnMode === 'auto' ? oppositeStoneColor(editor.nextTurn) : editor.nextTurn);
  },

  // addMove에 실패하면 에러 대신 원래 참조를 반환하는 함수
  addMoveToEditorWithoutError(editor: Editor, move: Move): Editor {
    try {
      return this.addMove(editor, move);
    } catch {
      return editor;
    }
  },

  // 유저에게 보여줄 장면 & 정보를 가져오는 함수
  currentScene(editor: Editor) {
    const scene = editor.scenes.get(editor.head)!;
    const sequences = this.getSequences(editor);
    const currMove = scene.newMove;

    const totalMoveCount = sequences.size;
    const deadStonesCount = getDeadStonesCount(scene.board, totalMoveCount);
    return { board: scene.board, sequences, currMove, nextTurn: editor.nextTurn, deadStonesCount };
  },

  changeNextTurn(editor: Editor): Editor {
    return editor.set('nextTurn', oppositeStoneColor(editor.nextTurn));
  },

  changeTurnMode(editor: Editor): Editor {
    return editor.set('changeTurnMode', editor.changeTurnMode === 'auto' ? 'manual' : 'auto');
  },

  // 모든 수순을 리스트로 반환한다. (수순보기 기능)
  getSequences(editor: Editor): List<Move> {
    return editor.scenes.map((scene) => scene.newMove).filter((move) => move !== null) as List<Move>;
  },

  // 처음으로 이동
  moveFirst: (editor: Editor) => editor.set('head', 0),

  // 마지막으로 이동
  moveLast: (editor: Editor) => editor.set('head', editor.scenes.size - 1),

  // N수 전후로 이동
  moveTo: (editor: Editor, to: number) => {
    const { scenes, head } = editor;
    const adjustInRange = (x: number, min: number, max: number) => (x < min ? min : x > max ? max : x);
    const nextHead = adjustInRange(head + to, 0, scenes.size - 1);
    return editor.set('head', nextHead);
  },
};

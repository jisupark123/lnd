import { List, Map, Record, Set } from 'immutable';

export type StoneColor = 'BLACK' | 'WHITE';
export type Color = 'BLACK' | 'WHITE' | 'EMPTY';

const BLACK: Color = 'BLACK';
const WHITE: Color = 'WHITE';
const EMPTY: Color = 'EMPTY';

// 바둑판을 나타내는 클래스
class Board extends Record({ dimensions: 19, moves: Map<Coordinate, Color>() }, 'Board') {
  constructor(dimensions: number, ...moves: Move[]) {
    super({
      dimensions,
      moves: Map(moves.map((move) => [move.coordinate, move.color])),
    });
  }
}

// xy 좌표를 나타내는 클래스
class Coordinate extends Record({ x: 0, y: 0 }, 'Coordinate') {
  constructor(x: number, y: number) {
    super({ x, y });
  }
}

// 하나의 수를 나타내는 클래스
// xy 좌표 + 색
class Move extends Record({ coordinate: new Coordinate(0, 0), color: BLACK as Color }, 'Move') {
  constructor(coordinate: Coordinate, color: Color) {
    super({ coordinate, color });
  }
}

// 바둑에서 하나의 장면을 나타내는 클래스
// 바둑판 + 새로운 수
class Scene extends Record({ board: new Board(19), newMove: null as Move | null }, 'Scene') {
  constructor(board: Board, newMove?: Move) {
    super({ board, newMove: newMove ?? null });
  }
}

function makeScenesByMoves(basicBoard: Board, ...moves: Move[]): List<Scene> {
  return moves.reduce(
    (acc, move) => acc.push(new Scene(addMoveToBoard(acc.last()!.board, move), move)),
    List<Scene>([new Scene(basicBoard)])
  );
}

// 잡은돌 개수 구하기
function getDeadStonesCount(board: Board, totalMoveCount: number) {
  const blackOnBoard = board.moves.filter((color) => color === BLACK).size;
  const whiteOnBoard = board.moves.size - blackOnBoard;
  const blackTotalMoveCount = totalMoveCount % 2 == 0 ? totalMoveCount / 2 : Math.ceil(totalMoveCount / 2);
  const whiteTotalMoveCount = Math.floor(totalMoveCount / 2);
  return { black: blackTotalMoveCount - blackOnBoard, white: whiteTotalMoveCount - whiteOnBoard };
}

// 해당 좌표에 돌이 이미 존재하는지 반환
function isExistStone(board: Board, coordinate: Coordinate): boolean {
  return board.moves.has(coordinate);
}

// 바둑판에 돌 추가
// 1. 이미 그 자리에 돌이 있다면 error
// 2. 착수금지라면 error
// 3. 착수 후 따낼 돌을 모두 제거한 바둑판 반환
function addMoveToBoard(board: Board, move: Move): Board {
  if (isExistStone(board, move.coordinate)) {
    throw new Error(`지정한 좌표에 이미 돌이 존재합니다 x:${move.coordinate.x} y:${move.coordinate.y}`);
  }
  if (!isLegalMove(board, move)) {
    throw new Error(`착수금지입니다 x:${move.coordinate.x} y:${move.coordinate.y} ${move.color}`);
  }
  const killed: Set<Coordinate> = matchingAdjacentCoordinates(board, move.coordinate, oppositeColor(move.color)).reduce(
    (acc, coord) => acc.union(libertyCount(board, coord) === 1 ? group(board, coord) : Set()),
    Set()
  );

  return removeStones(board, killed).setIn(['moves', move.coordinate], move.color);
}

// 바둑판에서 주어진 좌표들을 모두 삭제
function removeStones(board: Board, coordinates: Set<Coordinate>): Board {
  return board.setIn(
    ['moves'],
    coordinates.reduce((acc, coordinate) => acc.delete(coordinate), board.moves)
  );
}

// 주어진 좌표에 착수할 수 있는지 검사
// 돌을 놨을 때 활로가 0이고 따낼 돌이 없다면 착수불가
function isLegalMove(board: Board, move: Move): boolean {
  // 돌을 놨다고 가정하고 활로를 계산
  const willHaveLiberties = libertyCount(board.setIn(['moves', move.coordinate], move.color), move.coordinate) > 0;

  // 활로가 있다면 착수 가능
  if (willHaveLiberties) {
    return true;
  }

  // 상대 돌을 따낼 수 있는지 검사
  // 1. 인접한 4곳의 상대 돌을 각각 그룹지어서
  // 2. 각각의 그룹 중에 활로가 1인 그룹이 있으면 착수해서 따낼 수 있다.
  const willKillSomething = matchingAdjacentCoordinates(board, move.coordinate, oppositeColor(move.color)).some(
    (coord) => libertyCount(board, coord) === 1
  );

  // 따낼 수 있다면 착수 가능
  if (willKillSomething) {
    return true;
  }
  return false;
}

// 인접한 4곳 중에 같은 색의 돌이 있는 좌표를 반환하는 함수
// 빈곳의 좌표가 주어지면 인접한 빈곳의 좌표를 반환한다.
function matchingAdjacentCoordinates(board: Board, coordinate: Coordinate, color?: Color): Set<Coordinate> {
  const colorToMatch = color ?? board.moves.get(coordinate, EMPTY);
  return adjacentCoordinates(board, coordinate).filter((c) => board.moves.get(c, EMPTY) === colorToMatch);
}

// 인접한 4곳의 좌표를 모두 반환하는 함수. (바둑판의 범위를 초과하는 좌표는 제외)
function adjacentCoordinates(board: Board, coordinate: Coordinate): Set<Coordinate> {
  const { x, y } = coordinate;
  const validRange = (n: number) => 0 <= n && n < board.dimensions;

  return Set.of(
    new Coordinate(x, y + 1),
    new Coordinate(x, y - 1),
    new Coordinate(x + 1, y),
    new Coordinate(x - 1, y)
  ).filter((c) => validRange(c.x) && validRange(c.y));
}

// 지정된 돌의 모든 활로를 반환
// 연결된 돌이 있다면 연결된 돌의 모든 활로를 반환
// 빈곳을 지정하면 모든 빈곳을 반환
function liberties(board: Board, coordinate: Coordinate): Set<Coordinate> {
  return group(board, coordinate).reduce(
    (acc, coord) => acc.union(matchingAdjacentCoordinates(board, coord, EMPTY)),
    Set()
  );
}

// 지정된 돌의 활로 개수를 반환
function libertyCount(board: Board, coordinate: Coordinate): number {
  return liberties(board, coordinate).size;
}

// 주어진 좌표에 위치한 돌을 포함해서 같은 색으로 연결된 모든 돌의 좌표를 반환
// 만약 빈 곳이라면 모든 빈곳을 반환
function group(board: Board, coordinate: Coordinate): Set<Coordinate> {
  let found = Set<Coordinate>();
  let queue = Set.of(coordinate);

  while (!queue.isEmpty()) {
    const current: Coordinate = queue.first();
    const more_matching = matchingAdjacentCoordinates(board, current);

    found = found.add(current);
    queue = queue.rest().union(more_matching.subtract(found));
  }

  return found;
}

// 검은돌 -> 흰돌
// 흰돌 -> 검은돌
function oppositeColor(color: Color): Color {
  if (color === BLACK) {
    return WHITE;
  } else if (color === WHITE) {
    return BLACK;
  } else {
    return EMPTY;
  }
}

function oppositeStoneColor(stoneColor: StoneColor): StoneColor {
  if (stoneColor === 'BLACK') {
    return 'WHITE';
  } else {
    return 'BLACK';
  }
}

// 바둑판 시각화
function showBoard(board: Board): void {
  const colorMap = {
    [BLACK]: '○',
    [WHITE]: '●',
    [EMPTY]: '+',
  };
  let boardString = '';
  for (let i = 0; i < board.dimensions; i++) {
    for (let j = 0; j < board.dimensions; j++) {
      const color = board.moves.get(new Coordinate(j, i), EMPTY);
      boardString += colorMap[color];
      boardString += ' ';
    }
    boardString += '\n';
  }
  console.log(boardString);
}

export {
  Board,
  Coordinate,
  Move,
  Scene,
  BLACK,
  WHITE,
  EMPTY,
  adjacentCoordinates,
  matchingAdjacentCoordinates,
  group,
  liberties,
  libertyCount,
  isLegalMove,
  showBoard,
  addMoveToBoard,
  isExistStone,
  oppositeColor,
  getDeadStonesCount,
  makeScenesByMoves,
  oppositeStoneColor,
};

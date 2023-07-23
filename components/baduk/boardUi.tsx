import { TAILWIND_sm } from '@/constants/mediaQuery';
import { BLACK, Board, Color, Coordinate, Move, StoneColor, isExistStone } from '@/libs/domain/baduk/baduk';
import { List, Set } from 'immutable';
import React, { RefObject, useEffect, useRef, useState } from 'react';

const boardConfigs = {
  lineWidth: 1, // Line 사이즈
  bgColor: '#E2E0CC', // 바둑판 색
  lineColor: '#797876', // Line 색
  dotColor: '#8C878A',
  blackStoneColor: '#000000', // 검은돌 색
  whiteStoneColor: '#ffffff', // 흰돌 색
  blackStonePreviewColor: 'rgba(0, 0, 0, 0.3)', // 검은돌 미리보기 색
  whiteStonePreviewColor: 'rgba(255,255,255,0.8)', // 흰돌 미리보기 색
  blackStoneSequenceColor: '#ffffff', // 검은돌 수순표시 색
  whiteStoneSequenceColor: '#000000', // 흰돌 수순표시 색
  markColor: '#4E61F8', // 최근 수 표시 테두리 색

  // 점 찍을 위치
  dotLocations: [
    {
      dimensions: 9,
      coordinates: [],
    },
    {
      dimensions: 11,
      coordinates: [new Coordinate(4, 4)],
    },
    {
      dimensions: 13,
      coordinates: [],
    },
    {
      dimensions: 19,
      coordinates: [
        new Coordinate(3, 3),
        new Coordinate(9, 3),
        new Coordinate(15, 3),
        new Coordinate(3, 9),
        new Coordinate(9, 9),
        new Coordinate(15, 9),
        new Coordinate(3, 15),
        new Coordinate(9, 15),
        new Coordinate(15, 15),
      ],
    },
  ],
  // 바둑판 끝 margin
  // getEndMargin: (boardSize: number) => boardSize * 0.03,
  getEndMargin: (boardSize: number, dimensions: number) => boardSize * (1 / dimensions) * 0.7,
  // getEndMargin: (boardSize: number, dimensions: number) => 30,

  // 바둑알 사이즈
  getStoneSize: (boardSize: number, dimensions: number) => boardConfigs.getLineGap(boardSize, dimensions) * 0.92,

  // 화점 사이즈
  getDotSize: (boardSize: number, dimensions: number) => boardConfigs.getLineGap(boardSize, dimensions) * 0.28,

  // Line 사이 간격
  getLineGap: (boardSize: number, dimensions: number) =>
    (boardSize - 2 * boardConfigs.getEndMargin(boardSize, dimensions) - dimensions * boardConfigs.lineWidth) /
    (dimensions - 1),

  // 바둑판 좌표 -> Canvas 좌표 변환
  getCoordinateByXy: (x: number, y: number, boardSize: number, dimensions: number) => {
    const lineGap = boardConfigs.getLineGap(boardSize, dimensions);
    const coordinateX = boardConfigs.getEndMargin(boardSize, dimensions) + x * (boardConfigs.lineWidth + lineGap);
    const coordinateY = boardConfigs.getEndMargin(boardSize, dimensions) + y * (boardConfigs.lineWidth + lineGap);
    return [coordinateX, coordinateY];
  },

  // Canvas 좌표 -> 바둑판 좌표 변환
  getXyByCoordinate: (coordinateX: number, coordinateY: number, boardSize: number, dimensions: number) => {
    const endMargin = boardConfigs.getEndMargin(boardSize, dimensions);
    const lineGap = boardConfigs.getLineGap(boardSize, dimensions);
    const adjustInRange = (x: number, min: number, max: number) => (x < min ? min : x > max ? max : x);
    const x = Math.round(
      adjustInRange(coordinateX - endMargin, 0, boardSize - endMargin * 2) / (lineGap + boardConfigs.lineWidth),
    );
    const y = Math.round(
      adjustInRange(coordinateY - endMargin, 0, boardSize - endMargin * 2) / (lineGap + boardConfigs.lineWidth),
    );
    return [x, y];
  },
  getSequenceDisplayTextSize: (boardSize: number, dimensions: number) => {
    return boardConfigs.getStoneSize(boardSize, dimensions) * 0.5;
  },
  getMarkWidth: (boardSize: number, dimensions: number) => boardConfigs.getStoneSize(boardSize, dimensions) * 0.125,
};

const boardUiTools = {
  upscaleCanvas: (canvas: RefObject<HTMLCanvasElement>, ctx: CanvasRenderingContext2D, boardSize: number) => {
    if (canvas.current) {
      const dpr = window.devicePixelRatio;
      canvas.current.width = boardSize * dpr;
      canvas.current.height = boardSize * dpr;
      ctx.scale(dpr, dpr);
    }
  },
  initBoard: (ctx: CanvasRenderingContext2D, board: Board, boardSize: number) => {
    ctx.fillStyle = boardConfigs.bgColor;
    ctx.fillRect(0, 0, boardSize, boardSize);
    ctx.stroke();
    boardUiTools.drawLines(ctx, boardSize, board.dimensions);
    boardUiTools.drawDots(
      ctx,
      boardSize,
      board.dimensions,
      ...boardConfigs.dotLocations.find((dot) => dot.dimensions === board.dimensions)!.coordinates,
    );
  },
  drawLines: (ctx: CanvasRenderingContext2D, boardSize: number, dimensions: number) => {
    const endMargin = boardConfigs.getEndMargin(boardSize, dimensions);
    const lineGap = boardConfigs.getLineGap(boardSize, dimensions) + boardConfigs.lineWidth;

    // ctx.fillStyle = boardConfigs.lineColor;
    ctx.lineWidth = boardConfigs.lineWidth;
    ctx.strokeStyle = boardConfigs.lineColor;

    // 가로선 그리기
    let y = endMargin;
    for (let i = 0; i < dimensions; i++) {
      ctx.beginPath();
      ctx.moveTo(endMargin, y);
      ctx.lineTo(boardSize - endMargin, y);

      ctx.stroke();
      y += lineGap;
    }

    // 세로선 그리기
    let x = endMargin;
    for (let i = 0; i < dimensions; i++) {
      ctx.beginPath();
      ctx.moveTo(x, endMargin);
      ctx.lineTo(x, boardSize - endMargin);
      ctx.stroke();
      x += lineGap;
    }
  },
  drawDots: (ctx: CanvasRenderingContext2D, boardSize: number, dimensions: number, ...dots: Coordinate[]) => {
    const dotSize = boardConfigs.getDotSize(boardSize, dimensions);
    ctx.lineWidth = dotSize;
    ctx.fillStyle = boardConfigs.dotColor;
    dots.forEach((dot) => {
      const [x, y] = boardConfigs.getCoordinateByXy(dot.x, dot.y, boardSize, dimensions);
      ctx.beginPath();
      ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2); // x,y,반지름,시작 각도,끝 각도
      ctx.fill();
    });
  },
  drawStones: (ctx: CanvasRenderingContext2D, boardSize: number, dimensions: number, board: Board) => {
    const stoneSize = boardConfigs.getStoneSize(boardSize, dimensions);
    board.moves.keySeq().forEach((coordinate) => {
      const [x, y] = boardConfigs.getCoordinateByXy(coordinate.x, coordinate.y, boardSize, dimensions);
      const color = board.moves.get(coordinate);
      ctx.fillStyle = color === 'BLACK' ? boardConfigs.blackStoneColor : boardConfigs.whiteStoneColor;
      ctx.beginPath();
      ctx.arc(x, y, stoneSize / 2, 0, Math.PI * 2); // x,y,반지름,시작 각도,끝 각도
      ctx.fill();
    });
  },
  drawStonePreview: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: Color,
    boardSize: number,
    dimensions: number,
  ) => {
    const stoneSize = boardConfigs.getStoneSize(boardSize, dimensions);
    const [coordinateX, coordinateY] = boardConfigs.getCoordinateByXy(x, y, boardSize, dimensions);
    ctx.fillStyle = color === BLACK ? boardConfigs.blackStonePreviewColor : boardConfigs.whiteStonePreviewColor;
    ctx.beginPath();
    ctx.arc(coordinateX, coordinateY, stoneSize / 2, 0, Math.PI * 2); // x,y,반지름,시작 각도,끝 각도
    ctx.fill();
  },
  drawSequences: (
    ctx: CanvasRenderingContext2D,
    boardSize: number,
    dimensions: number,
    board: Board,
    sequences: List<Move>,
    fontFamily?: string,
  ) => {
    const textSize = boardConfigs.getSequenceDisplayTextSize(boardSize, dimensions);

    let renderedStones = Set<Coordinate>();
    sequences.reverse().forEach((move, i) => {
      if (isExistStone(board, move.coordinate) && !renderedStones.has(move.coordinate)) {
        renderedStones = renderedStones.add(move.coordinate);
        const [x, y] = boardConfigs.getCoordinateByXy(move.coordinate.x, move.coordinate.y, boardSize, dimensions);
        ctx.fillStyle =
          move.color === BLACK ? boardConfigs.blackStoneSequenceColor : boardConfigs.whiteStoneSequenceColor;
        ctx.font = `normal bold ${textSize}px ${fontFamily ?? 'system-ui'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${sequences.size - i}`, x, y);
      }
    });
  },
  drawMark: (ctx: CanvasRenderingContext2D, boardSize: number, dimensions: number, move: Move) => {
    const stoneSize = boardConfigs.getStoneSize(boardSize, dimensions);
    const [x, y] = boardConfigs.getCoordinateByXy(move.coordinate.x, move.coordinate.y, boardSize, dimensions);
    ctx.strokeStyle = boardConfigs.markColor;
    ctx.lineWidth = boardConfigs.getMarkWidth(boardSize, dimensions);
    ctx.beginPath();
    ctx.arc(x, y, stoneSize / 2, 0, Math.PI * 2); // x,y,반지름,시작 각도,끝 각도
    ctx.stroke();
  },
};

export interface BoardUiConfigs {
  board: Board;
  sequences: Immutable.List<Move>;
  currMove: Move | null;
  nextTurn: StoneColor;
  addMove: (move: Move) => void;
}

interface Props extends BoardUiConfigs {
  size: number;
  showSequences?: boolean;
  showCurrMoveMark?: boolean;
  fontFamily?: string;
}

const BoardUi: React.FC<Props> = ({
  size,
  board,
  sequences,
  currMove,
  nextTurn,
  showSequences,
  showCurrMoveMark,
  fontFamily,
  addMove,
}) => {
  const canvas: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const [stonePreview, setStonePreview] = useState<Coordinate | null>(null);

  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const [x, y] = boardConfigs.getXyByCoordinate(e.nativeEvent.offsetX, e.nativeEvent.offsetY, size, board.dimensions);
    console.log(x, y);
    addMove(new Move(new Coordinate(x, y), nextTurn));
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    const [x, y] = boardConfigs.getXyByCoordinate(e.nativeEvent.offsetX, e.nativeEvent.offsetY, size, board.dimensions);
    const newPreview = new Coordinate(x, y);

    if (isExistStone(board, newPreview)) {
      setStonePreview(null);
    } else if (!newPreview.equals(stonePreview)) {
      setStonePreview(newPreview);
    }
  }

  function onMouseLeave() {
    setStonePreview(null);
  }

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;

    if (size < TAILWIND_sm) {
      boardConfigs.lineWidth = 0.5;
    }

    boardUiTools.upscaleCanvas(canvas, ctx, size);
    boardUiTools.initBoard(ctx, board, size);
    boardUiTools.drawStones(ctx, size, board.dimensions, board);
    if (currMove && showCurrMoveMark) {
      boardUiTools.drawMark(ctx, size, board.dimensions, currMove);
    }
    if (showSequences) {
      boardUiTools.drawSequences(ctx, size, board.dimensions, board, sequences, fontFamily);
    }

    if (stonePreview) {
      boardUiTools.drawStonePreview(ctx, stonePreview.x, stonePreview.y, nextTurn, size, board.dimensions);
    }
    ctx.beginPath();
    ctx.arc(0, 0, 0, 0, 0);
    ctx.fill();
    return () => {
      ctx.clearRect(0, 0, size, size);
    };
  });

  return (
    <canvas
      ref={canvas}
      width={size}
      height={size}
      onMouseUp={onMouseUp}
      style={{ width: size, height: size }}
      // onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    ></canvas>
  );
};

export default BoardUi;

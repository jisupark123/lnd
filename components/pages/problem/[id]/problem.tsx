import BoardUi from '@/components/baduk/boardUi';
import { TAILWIND_lg, TAILWIND_md } from '@/constants/mediaQuery';
import useProblem from '@/hooks/useProblem';
import { problemToolkit } from '@/libs/domain/baduk/problem';
import { ProblemFormat } from '@/types/problem';
import React, { HTMLAttributes, useEffect, useState } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  format: ProblemFormat;
  onSuccess: () => void;
  onFailed: () => void;
}

const getBoardSize = (screenWidth: number) => {
  if (screenWidth < TAILWIND_lg) {
    const innerPadding = 20; // 안쪽 패딩
    const outerPadding = 20; // 바깥쪽 패딩
    const parentWidth = screenWidth - innerPadding * 2 - outerPadding * 2;
    return parentWidth;
  } else {
    const innerPadding = 50; // 안쪽 패딩
    const outerPadding = 80; // 바깥쪽 패딩
    const parentWidth = screenWidth - innerPadding * 2 - outerPadding * 2;

    return 600;
  }
};

export default function Problem({ format, onSuccess, onFailed }: Props) {
  const [boardSize, setBoardSize] = useState<number | null>(null);

  const { boardUIConfigs } = useProblem(problemToolkit.formatToProblem(format), onSuccess, onFailed);

  useEffect(() => {
    setBoardSize(getBoardSize(window.innerWidth));
    window.addEventListener('resize', () => {
      setBoardSize(getBoardSize(window.innerWidth));
    });
  }, []);

  return <div>{boardSize && <BoardUi {...boardUIConfigs} size={boardSize} />}</div>;
}

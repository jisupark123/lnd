import { Basis, basisToolkit } from '@/lib/basis';
import { Move } from '@/lib/baduk';
import { Problem, problemToolkit } from '@/lib/problem';
import { useState } from 'react';

const useProblem = (problem: Problem, onSuccess: () => void, onFailure: () => void) => {
  const [basis, setBasis] = useState(
    new Basis({
      dimensions: problem.dimensions,
      basicBoard: problem.shape,
      nextTurn: problem.firstTurn,
    })
  );
  const { board, sequences, currMove, nextTurn } = basisToolkit.currentScene(basis);

  // 1. 사용자가 돌을 놓는다.
  // 2. isInAnswers로 정답도/오답도에 있는 수인가 조사해서 참일 경우에만 돌을 추가한다. (거짓일 경우 무시한다)
  // 3. getResponse로 상태, 다음 수를 받아온다. (바둑판 비활성화 시키기)
  // 4. 받아온 상태가 'success'일 경우, onSuccess 함수를 실행한다.
  // 5. 받아온 상태가 'progress'일 경우, 응수한다. (바둑판 활성화 시키기)
  const addMove = (move: Move) => {
    // 다움 수가 포함된 바둑판
    const nextBasis = basisToolkit.addMoveWithoutError(basis, move);

    // 연속으로 빠르게 누르는 것 방지
    if (move.color !== problem.firstTurn) return;

    // 이미 있는 돌이나 착수금지 클릭했을 때
    if (nextBasis === basis) return;

    // 사용자가 놓은 돌이 보유한 정답도/실패도에 존재할 경우에만 진행
    if (problemToolkit.isInAnswers(problem, nextBasis)) {
      // 사용자가 놓을 돌 보여주기
      setBasis((prev) => basisToolkit.addMoveWithoutError(prev, move));

      // 어떻게 응수할지 / 성공,실패인지
      const { status, nextMove } = problemToolkit.getResponse(problem, nextBasis);

      // 성공
      if (status === 'success') {
        setTimeout(() => {
          onSuccess();
        }, 800);
      }

      // 성공이 아니라면 응수하기
      setTimeout(() => {
        setBasis(basisToolkit.addMoveWithoutError(nextBasis, nextMove!));
      }, 500);

      // 실패
      if (status === 'failure') {
        setTimeout(() => {
          onFailure();
        }, 1000);
      }
    }
  };
  return {
    boardUIConfigs: { board, sequences, currMove, nextTurn, addMove },
  };
};

export default useProblem;

import { createNewProblem } from '@/apis/problem';
import Layout from '@/components/layout/layout';
import ProblemEditor from '@/components/pages/problem/new/problemEditor';
import ProblemMakerInfoMenus from '@/components/pages/problem/new/problemInfoMenus';
import Underline from '@/components/underline';
import { StoneColor } from '@/libs/domain/baduk/baduk';
import { Editor, editorToolkit } from '@/libs/domain/baduk/editor';
import { problemToolkit } from '@/libs/domain/baduk/problem';
import { Level } from '@/libs/domain/level';
import useAlert from '@/recoil/alert/useAlert';
import { ProblemFormat, ProblemResult, ProblemType } from '@/types/problem';
import { List } from 'immutable';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { PostProblemReqBody } from '../api/problem';
import { PROBLEM_HINT_LIMIT } from '@/constants/problem';
import { useUserQuery } from '@/query/user/useUserQuery';

// 문제 제작은 최종적으로 화면에 나와있는 모양 그대로 업로드된다.
// Editor로 뒤로가기하면 그 장면이 적용된다.

export interface ProblemMakerInfo {
  type: ProblemType;
  level: Level;
  firstTurn: StoneColor;
  result: ProblemResult;
}

const initialProblemMakerInfo: ProblemMakerInfo = {
  type: '사활',
  level: 'gold',
  firstTurn: 'BLACK',
  result: '살리는 문제',
};

const initialShapeMaker = new Editor({ dimensions: 13, changeTurnSetting: { mode: 'manual', stoneColor: 'BLACK' } });

const { currentScene } = editorToolkit;

const New = () => {
  const router = useRouter();
  const { user, isError: isUserError } = useUserQuery();
  const { showAlert } = useAlert();
  const [problemMakerInfo, setProblemMakerInfo] = useState<ProblemMakerInfo>(initialProblemMakerInfo);
  const [shapeMaker, setShapeMaker] = useState(initialShapeMaker);
  const [correctAnswerMakers, setCorrectAnswerMakers] = useState<List<Editor>>(
    List([new Editor({ dimensions: 13, firstTurn: problemMakerInfo.firstTurn })]),
  );
  const [wrongAnswerMakers, setWrongAnswerMakers] = useState<List<Editor>>(List([]));

  const { mutate, isLoading: uploadIsLoading } = useMutation(createNewProblem);

  const hintRef = useRef<HTMLInputElement>(null);

  // 정답도나 오답도가 변경된 상태인지
  // 기본으로 초기화되는 정답도 한개보다 작업 중인 개수가 많을 시 true 리턴
  // 정답도나 실패도 둘 중 하나라도 변경되었다면 true 리턴
  const answerMakersChanged =
    correctAnswerMakers.size + wrongAnswerMakers.size > 1 ||
    (correctAnswerMakers.size &&
      !currentScene(correctAnswerMakers.get(0)!).board.equals(currentScene(shapeMaker).board)) ||
    (wrongAnswerMakers.size && !currentScene(wrongAnswerMakers.get(0)!).board.equals(currentScene(shapeMaker).board));

  // 흑선/백선을 변경했을 때 경고창을 띄우고 작업중인 문제도/정답도/실패도를 초기화시키는 함수
  // 1. 기존에 선택되어있던 차례를 클릭하면 그냥 return
  // 2. answerMakersChanged 를 체크한다.
  // 2-1. 변경되었다면 경고창 띄우기 + 초기화
  // 2-2. else -> 초기화
  const toggleFirstTurn = (newFirstTurn: StoneColor) => {
    if (newFirstTurn === problemMakerInfo.firstTurn) {
      return;
    }
    if (answerMakersChanged) {
      showAlert({
        alertViewTitle: '차례를 변경하면 정답도 / 오답도가 초기화됩니다.',
        alertViewType: 'destructive',
        alertActions: [
          { title: '취소', style: 'primary', handler: null },
          {
            title: '확인',
            style: 'destructive',
            handler: () => {
              resetMakers(shapeMaker);
              setProblemMakerInfo((prev) => ({ ...prev, firstTurn: newFirstTurn }));
            },
          },
        ],
      });
    } else {
      resetMakers(shapeMaker);
      setProblemMakerInfo((prev) => ({ ...prev, firstTurn: newFirstTurn }));
    }
  };

  // 정답도와 실패도를 초기화시키는 함수
  // 정답도는 하나만 남기고 문제도와 일치시킨다.
  const resetMakers = (editor: Editor) => {
    setShapeMaker(editor);
    setCorrectAnswerMakers(List([makeAnswerMakerSameWithShape(editor)]));
    setWrongAnswerMakers(List());
  };

  // 문제도와 같은 모양으로 정답도/실패도를 초기화시키는 함수
  const makeAnswerMakerSameWithShape = (shape: Editor) =>
    new Editor({
      dimensions: shape.dimensions,
      basicBoard: shape.scenes.get(shape.head)?.board,
      firstTurn: problemMakerInfo.firstTurn,
    });

  // 문제도에 돌이 놓여질 때 실행되는 함수
  // 1. answerMakersChanged 검사
  // 1-1. 변경되었다면 모달로 물어보기 + 정답도/실패도 초기화
  // 1-2. else -> 초기화
  const handleChangeShapeMaker = (newEditor: Editor) => {
    if (answerMakersChanged) {
      // 모달로 물어보기
      showAlert({
        alertViewTitle: '문제도를 변경하면 작업 중인 정답도 / 오답도가 초기화됩니다.',
        alertViewType: 'destructive',
        closeWithTouchBackdrop: true,
        alertActions: [
          { title: '취소', style: 'primary', handler: null },
          {
            title: '확인',
            style: 'destructive',
            handler: () => {
              resetMakers(newEditor);
            },
          },
        ],
      });
    } else {
      resetMakers(newEditor);
    }
  };

  // editor state를 ProblemFormat 으로 변환
  const makeProblemFormat = (): ProblemFormat => {
    return {
      dimensions: shapeMaker.dimensions,
      firstTurn: problemMakerInfo.firstTurn,
      shape: problemToolkit.boardToFormatMoves(currentScene(shapeMaker).board),
      correctAnswers: correctAnswerMakers
        .map((editor) =>
          currentScene(editor)
            .sequences.map((move) => ({
              x: move.coordinate.x,
              y: move.coordinate.y,
              stoneColor: move.color as StoneColor,
            }))
            .toArray(),
        )
        .toArray(),
      wrongAnswers: wrongAnswerMakers
        .map((editor) =>
          currentScene(editor)
            .sequences.map((move) => ({
              x: move.coordinate.x,
              y: move.coordinate.y,
              stoneColor: move.color as StoneColor,
            }))
            .toArray(),
        )
        .toArray(),
    };
  };

  // 실제로 업로드를 실행하는 함수
  // react-query의 mutate 메소드로 구현
  // 에러 시 다시 시도하기를 재귀적으로 구현하기 위해 함수를 따로 분리함
  const fetchUploadProblem = (reqBody: PostProblemReqBody) => {
    mutate(reqBody, {
      onSuccess: () => {
        showAlert({
          alertViewType: 'primary',
          alertViewTitle: '성공적으로 업로드되었습니다!',
          closeWithTouchBackdrop: true,
          alertActions: [
            {
              title: '홈으로 돌아가기',
              style: 'normal',
              handler: () => {
                router.push('/');
              },
            },
            {
              title: '다음 문제 만들기',
              style: 'primary',
              handler: () => {
                router.reload();
              },
            },
          ],
        });
      },
      onError: () => {
        showAlert({
          alertViewType: 'destructive',
          alertViewTitle: '업로드에 실패했습니다.',
          closeWithTouchBackdrop: true,
          alertActions: [
            {
              title: '다시 시도하기',
              style: 'destructive',
              handler: () => {
                fetchUploadProblem(reqBody);
              },
            },
          ],
        });
      },
    });
  };

  // 공통적으로 사용할 실패 알림 스타일
  const alertUploadFailed = (msg: string) => {
    showAlert({
      alertViewTitle: msg,
      alertViewType: 'destructive',
      closeWithTouchBackdrop: true,
      alertActions: [
        {
          title: '확인',
          style: 'destructive',
          handler: null,
        },
      ],
    });
  };

  // 최종적으로 문제 업로드 버튼 클릭 시 실행될 함수
  // 업로드할 문제도/정답도/실패도에 이상이 없는지 확인하고 이상이 있을 시 alert, 없을 시 업로드한다.
  //
  // 1. 정답도가 최소 하나 있는지 검사
  // 2. 정답도 중에 문제도와 중복되는게 있는지 검사 (추후 업데이트 -> 정답도/실패도간 중복 검사)
  // 3. 실패도 중에 문제도와 중복되는게 있는지 검사
  //
  const handleUploadProblem = () => {
    if (!currentScene(shapeMaker).board.moves.size) {
      alertUploadFailed('문제를 입력해주세요.');
      return;
    }
    if (correctAnswerMakers.size === 0) {
      alertUploadFailed('정답도는 최소 하나여야 합니다.');
      return;
    }

    // 문제도와 겹치는 정답도 인덱스
    const sameCorrectAnswersWithShape: number[] = [];
    correctAnswerMakers.forEach((answer, i) => {
      if (currentScene(answer).board.equals(currentScene(shapeMaker).board)) {
        sameCorrectAnswersWithShape.push(i);
      }
    });
    if (sameCorrectAnswersWithShape.length) {
      alertUploadFailed(
        `${sameCorrectAnswersWithShape.map((i) => `0${String(i + 1)}`).join(', ')} 번 정답도가 문제도와 일치합니다.`,
      );
      return;
    }

    // 문제도와 겹치는 실패도 인덱스
    const sameWrongAnswersWithShape: number[] = [];
    wrongAnswerMakers.forEach((answer, i) => {
      if (currentScene(answer).board.equals(currentScene(shapeMaker).board)) {
        sameWrongAnswersWithShape.push(i);
      }
    });
    if (sameWrongAnswersWithShape.length) {
      alertUploadFailed(
        `${sameWrongAnswersWithShape.map((i) => `0${String(i + 1)}`).join(', ')} 번 실패도가 문제도와 일치합니다.`,
      );
      return;
    }
    const hint = hintRef.current?.value.trim() ?? null;

    // 힌트 100자 제한
    if (hint && hint.length > PROBLEM_HINT_LIMIT) {
      alertUploadFailed(`힌트는 100자 이내로 작성해주세요. (현재 ${hint.length}자)`);
    }

    const { level, type, result } = problemMakerInfo;
    const format = makeProblemFormat();
    fetchUploadProblem({ level, type, result, hint, format });
  };

  // 차례(흑선/백선) 설정이 변경될 때마다 모든 정답도/실패도에 동기화시키는 함수
  // 로직 상 차례가 변경되면 정답도/실패도가 초기화되지만 동기화시키기 애매해서 이 방식이 더 깔끔하다고 판단함
  useEffect(() => {
    setCorrectAnswerMakers((prev) => prev.map((editor) => editor.set('firstTurn', problemMakerInfo.firstTurn)));
    setWrongAnswerMakers((prev) => prev.map((editor) => editor.set('firstTurn', problemMakerInfo.firstTurn)));
  }, [problemMakerInfo.firstTurn]);

  // 접근 권한 검사
  useEffect(() => {
    if (isUserError || (user && !user.authorities.includes('problemUpload'))) {
      alert('접근 권한이 없는 페이지입니다.');
      router.push('/');
    }
  }, [user, isUserError, router]);

  return (
    <Layout>
      {user && (
        <main className='py-50 px-20 lg:px-150 xl:px-200'>
          <div className=' w-full p-50 pb-100 rounded-20 bg-white'>
            <h1 className=' text-24 font-bold text-primary mb-100'>문제 생성하기</h1>
            <div className='mb-30 flex items-center gap-5'>
              <h3 className='text-20 font-bold text-primary'>문제 정보</h3>
              <span className=' text-danger text-18 font-normal'>*</span>
            </div>
            <ProblemMakerInfoMenus {...{ problemMakerInfo, setProblemMakerInfo, toggleFirstTurn }} className='mb-50' />
            <h4 className=' text-16 font-bold text-primary mb-10'>힌트</h4>
            <input
              type='text'
              placeholder='100자 제한'
              ref={hintRef}
              className=' w-full p-5 border-b-1 border-gray text-14 mb-100 placeholder:text-14'
              spellCheck={false}
            />
            <div className='mb-30 flex items-center gap-5'>
              <h3 className='text-20 font-bold text-primary'>문제도</h3>
              <span className=' text-danger text-18 font-normal'>*</span>
            </div>

            <ProblemEditor
              editor={shapeMaker}
              editorSize={600}
              hasBwSwitch
              setEditor={handleChangeShapeMaker}
              className=' mb-50'
            />
            <Underline className=' mb-50' />
            <div className='mb-30 flex items-center gap-5'>
              <h3 className='text-20 font-bold text-primary'>정답도</h3>
              <span className=' text-danger text-18 font-normal'>*</span>
            </div>

            {correctAnswerMakers.map((maker, i) => (
              <ProblemEditor
                key={i}
                editor={maker}
                editorSize={600}
                hasBwSwitch={false}
                title={`0${i + 1}`}
                showDeleteBtn
                showSequences
                setEditor={(newEditor: Editor) => {
                  setCorrectAnswerMakers((prev) => prev.set(i, newEditor));
                }}
                deleteEditor={() => setCorrectAnswerMakers((prev) => prev.remove(i))}
                className=' mb-50'
              />
            ))}
            <button
              className=' mb-50 py-8 px-35 bg-bg_1 text-16 font-bold text-primary border-1 border-solid border-primary rounded-12'
              onClick={() => setCorrectAnswerMakers((prev) => prev.push(makeAnswerMakerSameWithShape(shapeMaker)))}
            >
              정답도 추가하기
            </button>
            <Underline className=' mb-50' />
            <h3 className='text-20 font-bold text-primary mb-10'>실패도</h3>
            <h6 className=' text-gray font-normal text-12 mb-30'>실패도는 필수 항목이 아닙니다.</h6>
            {wrongAnswerMakers.map((maker, i) => (
              <ProblemEditor
                key={i}
                editor={maker}
                editorSize={600}
                hasBwSwitch={false}
                title={`0${i + 1}`}
                showDeleteBtn
                showSequences
                setEditor={(newEditor: Editor) => {
                  setWrongAnswerMakers((prev) => prev.set(i, newEditor));
                }}
                deleteEditor={() => setWrongAnswerMakers((prev) => prev.remove(i))}
                className=' mb-50'
              />
            ))}
            <button
              className=' mb-50 py-8 px-35 bg-bg_1 text-16 font-bold text-primary border-1 border-solid border-primary rounded-12'
              onClick={() => setWrongAnswerMakers((prev) => prev.push(makeAnswerMakerSameWithShape(shapeMaker)))}
            >
              실패도 추가하기
            </button>
            <Underline className=' mb-100' />
            <div className='w-full flex justify-center'>
              <button
                onClick={handleUploadProblem}
                className='py-8 px-50 bg-primary text-white font-bold text-16 rounded-full'
              >
                {uploadIsLoading ? '업로드 중...' : '문제 업로드'}
              </button>
            </div>
          </div>
        </main>
      )}
    </Layout>
  );
};

export default New;

import Layout from '@/components/layout/layout';
import { cls } from '@/libs/client/cls';
import { PROBLEM_SOLVE_QUERY_KEY, useProblemSolveQuery } from '@/query/problems/useProblemSolveQuery';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useAlert from '@/recoil/alert/useAlert';
import LogoIcon from '../../public/icons/logo.svg';
import LevelBar from '@/components/level-bar';
import { levelFromLevelScore } from '@/libs/domain/level';
import { ProblemResult } from '@/types/problem';
import Problem from '@/components/pages/problem/[id]/problem';
import capitalize from '@/libs/utils/capitalize';
import { StoneColor, oppositeStoneColor } from '@/libs/domain/baduk/baduk';
import { useQueryClient } from 'react-query';
import { fetchNewAttempt } from '@/apis/attempt';
import { useUserQuery } from '@/query/user/useUserQuery';

type Props = {};

// 문제 결과 변환
// 흑선, 죽이는 문제 -> 흑을 죽이는 문제
function convertResult(firstTurn: StoneColor, result: ProblemResult) {
  const translateColor = (color: StoneColor) => (color === 'BLACK' ? '흑' : '백');
  const target = result === '죽이는 문제' ? translateColor(oppositeStoneColor(firstTurn)) : translateColor(firstTurn);
  return result === '패' ? result : `${target}을 ${result}`;
}

export default function ProblemSolve({}: Props) {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const { user } = useUserQuery();
  const { problem, isLoading: isProblemLoading, isError } = useProblemSolveQuery(id as string);
  const { showAlert } = useAlert();
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSovlingFinishedLoading, setIsSovlingFinishedLoading] = useState(false); // 문제 풀이를 완료한 상태에서의 로딩

  const problemMetaInfos: { title: string; content: string | number }[] | null = problem
    ? [
        {
          title: '난이도',
          content: `${capitalize(levelFromLevelScore(problem.levelScore).level)} ${
            levelFromLevelScore(problem.levelScore).grade
          }`,
        },
        { title: '유형', content: problem.type },
        // { title: '시도', content: problem.attemptCount },
        { title: '풀이자 수', content: problem.answerCount },
        { title: '정답률', content: problem.answerRate },
      ]
    : null;

  const withHandleOnSolved = async (handler: () => Promise<void>) => {
    if (!user) {
      showAlert({
        alertViewTitle: '로그인이 필요한 기능입니다!',
        alertViewType: 'normal',
        closeWithTouchBackdrop: false,
        alertActions: [{ title: '로그인 페이지로 이동하기', style: 'primary', handler: () => router.push('/login') }],
      });
      return;
    }
    await handler();
  };

  const handleOnSuccess = async () => {
    setIsSovlingFinishedLoading(true);
    const response = await fetchNewAttempt(Number(id), true);
    setIsSovlingFinishedLoading(false);
    if (response.status === 200) {
      await queryClient.invalidateQueries([PROBLEM_SOLVE_QUERY_KEY, id]);
      queryClient.fetchQuery([PROBLEM_SOLVE_QUERY_KEY, id]);
      showAlert({
        alertViewTitle: '정답입니다!',
        alertViewType: 'primary',
        closeWithTouchBackdrop: true,
        alertActions: [{ title: '돌아가기', style: 'primary', handler: null }],
      });
    }
  };
  const handleOnFailed = async () => {
    setIsSovlingFinishedLoading(true);
    const response = await fetchNewAttempt(Number(id), false);
    setIsSovlingFinishedLoading(false);
    if (response.status === 200) {
      await queryClient.invalidateQueries([PROBLEM_SOLVE_QUERY_KEY, id]);
      queryClient.fetchQuery([PROBLEM_SOLVE_QUERY_KEY, id]);
      showAlert({
        alertViewTitle: '틀렸습니다.',
        alertViewType: 'destructive',
        closeWithTouchBackdrop: true,
        alertActions: [
          { title: '돌아가기', style: 'destructive', handler: null },
          { title: '재도전', style: 'primary', handler: router.reload },
        ],
      });
    }
  };

  return (
    <Layout>
      <main className='px-20 py-20 w-full lg:px-80 lg:py-50'>
        {problem && (
          <div className='w-full bg-white p-20 rounded-12'>
            {/* 상단 타이틀 */}
            <div className='flex items-center gap-10 mb-20'>
              <span className={cls('text-20 font-semibold tracking-wider md:text-24', `text-${problem.level}`)}>
                #{problem.id}
              </span>
              {problem.userSolved && (
                <div className={cls('py-3 px-8 text-12 rounded-4 text-white font-semibold', `bg-${problem.level}`)}>
                  성공
                </div>
              )}
            </div>

            {/* 유저 프로필 */}
            {/* <div className='flex items-center gap-10'>
              <LogoIcon width='32' height='32' />
              <div className='flex flex-col justify-center gap-8'>
                <span className='font-bold text-18 text-primary'>{problem.createdUserNickname ?? '모두의 사활'}</span>
                <LevelBar levelScore={problem.levelScore} className='w-100 h-4' />
              </div>
            </div> */}

            {/* 문제 정보 1 */}
            <div className='w-full bg-bg_1 py-10 px-20 mb-20 rounded-8 flex justify-between items-center max-w-800'>
              {problemMetaInfos!.map((info, i) => (
                <div key={i} className='flex flex-col justify-center gap-5'>
                  <span className='text-12 text-black font-semibold md:text-14 lg:text-16'>{info.title}</span>
                  <span className={cls('text-12 font-semibold md:text-14 lg:text-16', `text-${problem.level}`)}>
                    {info.content}
                  </span>
                </div>
              ))}
            </div>
            {/* 문제 정보 2 */}
            <div className='w-full bg-bg_1 py-10 px-20 mb-20 rounded-8 flex gap-20 max-w-800'>
              <div className='flex flex-col gap-10 text-12 md:text-14 lg:text-16'>
                <span className='text-black font-semibold'>차례</span>
                <span className='text-black font-semibold'>결과</span>
                <span className='text-black font-semibold'>힌트</span>
              </div>
              <div className='flex flex-col gap-10 text-12 md:text-14 lg:text-16'>
                <span className={'text-primary font-normal'}>
                  {problem.format.firstTurn === 'BLACK' ? '흑선' : '백선'}
                </span>
                <span
                  className={cls('text-primary font-normal', !showResult ? ' cursor-pointer' : '')}
                  onClick={() => setShowResult(true)}
                >
                  {showResult ? convertResult(problem.format.firstTurn, problem.result) : '보기'}
                </span>
                <span
                  className={cls('text-primary font-normal', !showHint ? '  cursor-pointer' : '')}
                  onClick={() => setShowHint(true)}
                >
                  {!problem.hint ? '힌트 없음' : showHint ? problem.hint : '보기'}
                </span>
              </div>
            </div>
            <Problem
              format={problem.format}
              onSuccess={() => withHandleOnSolved(handleOnSuccess)}
              onFailed={() => withHandleOnSolved(handleOnFailed)}
              className='mb-20'
            />
            {/* <div className='flex justify-start'>
              <button>재도전</button>
            </div> */}
          </div>
        )}
      </main>
    </Layout>
  );
}

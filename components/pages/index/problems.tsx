import LevelBar from '@/components/level-bar';
import { cls } from '@/libs/client/cls';
import { ProblemInfo } from '@/types/problem';
import Link from 'next/link';
import React, { HTMLAttributes } from 'react';
import LogoIcon from '../../../public/icons/logo.svg';

interface Props extends HTMLAttributes<HTMLDivElement> {
  problems: ProblemInfo[];
}

export default function Problems({ problems }: Props) {
  return (
    <div className='flex items-center flex-wrap gap-20 w-full'>
      {problems.map((problem) => (
        <Link
          href={`/problem/${problem.id}`}
          key={problem.id}
          className='rounded-12 overflow-hidden w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.3%-13.3px)] xl:w-[calc(25%-15px)]'
        >
          {/* 윗 박스 */}
          <div className={cls('h-70 p-14', `bg-${problem.level}`)}>
            <div className='flex items-center gap-3'>
              <span className='font-semibold text-18 text-white'>#</span>
              <span className=' font-semibold text-18 text-white'>{problem.id}</span>
            </div>
          </div>
          {/* 아래 박스 */}
          <div className='relative p-14 bg-white'>
            <div className='mb-14 flex items-center gap-10'>
              <span className='text-16 font-semibold text-black'>Lv</span>
              <LevelBar levelScore={problem.levelScore} className=' w-100 h-4' />
            </div>
            <div className='mb-14 flex items-center gap-5'>
              <span className='text-16 font-semibold text-black'>정답률</span>
              <span className={cls('text-16 font-semibold', `text-${problem.level}`)}>{problem.answerRate}</span>
            </div>
            <div className='flex items-center gap-5'>
              <span className='text-16 font-semibold text-black'>풀이자 수</span>
              <span className={cls('text-16 font-semibold', `text-${problem.level}`)}>{problem.answerCount}</span>
            </div>

            {/* 성공 표시 */}
            {problem.userSolved && (
              <div
                className={cls(
                  'absolute top-14 right-14 py-3 px-8 rounded-4 text-white font-semibold text-12',
                  `bg-${problem.level}`,
                )}
              >
                성공
              </div>
            )}

            {/* 만든 유저 아이콘 */}
            <div className='absolute bottom-14 right-14 flex items-center gap-5'>
              <LogoIcon width='20' height='12' />
              <span className=' text-primary font-semibold text-12'>모두의 사활</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

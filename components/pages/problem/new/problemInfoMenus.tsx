import DropDownMenu from '@/components/menu/checkBoxDropDownSelect';
import React, { HTMLAttributes } from 'react';
import ProblemMakerInfoDropdownMenu from './problemMakerInfoDropdownMenu';
import CheckBoxDropDownSelect, { CheckBoxDropDownOptions } from '@/components/menu/checkBoxDropDownSelect';
import capitalize from '@/libs/utils/capitalize';
import { ProblemMakerInfo } from '@/pages/problem/new';
import { cls } from '@/libs/client/cls';
import { StoneColor } from '@/libs/domain/baduk/baduk';
import { Level } from '@/libs/domain/level';
import { ProblemResult, ProblemType } from '@/types/problem';

interface Props extends HTMLAttributes<HTMLDivElement> {
  problemMakerInfo: ProblemMakerInfo;
  setProblemMakerInfo: React.Dispatch<React.SetStateAction<ProblemMakerInfo>>;
  toggleFirstTurn: (newFirstTurn: StoneColor) => void;
}

export default function ProblemMakerInfoMenus({
  problemMakerInfo,
  setProblemMakerInfo,
  toggleFirstTurn,
  ...props
}: Props) {
  const problemLevelOptions: CheckBoxDropDownOptions[] = [
    {
      selected: problemMakerInfo.level === 'bronze',
      content: <div className='font-medium text-black text-16'>Bronze</div>,
      value: 'bronze',
    },
    {
      selected: problemMakerInfo.level === 'silver',
      content: <div className='font-medium text-black text-16'>Silver</div>,
      value: 'silver',
    },
    {
      selected: problemMakerInfo.level === 'gold',
      content: <div className='font-medium text-black text-16'>Gold</div>,
      value: 'gold',
    },
    {
      selected: problemMakerInfo.level === 'platinum',
      content: <div className='font-medium text-black text-16'>Platinum</div>,
      value: 'platinum',
    },
    {
      selected: problemMakerInfo.level === 'diamond',
      content: <div className='font-medium text-black text-16'>Diamond</div>,
      value: 'diamond',
    },
    {
      selected: problemMakerInfo.level === 'ruby',
      content: <div className='font-medium text-black text-16'>Ruby</div>,
      value: 'ruby',
    },
    {
      selected: problemMakerInfo.level === 'master',
      content: <div className='font-medium text-black text-16'>Master</div>,
      value: 'master',
    },
  ];
  const problemTypeOptions: CheckBoxDropDownOptions[] = [
    {
      selected: problemMakerInfo.type === '사활',
      content: <div className='font-medium text-black text-16'>사활</div>,
      value: '사활',
    },
    {
      selected: problemMakerInfo.type === '수상전',
      content: <div className='font-medium text-black text-16'>수상전</div>,
      value: '수상전',
    },
    {
      selected: problemMakerInfo.type === '맥',
      content: <div className='font-medium text-black text-16'>맥</div>,
      value: '맥',
    },
    {
      selected: problemMakerInfo.type === '끝내기',
      content: <div className='font-medium text-black text-16'>끝내기</div>,
      value: '끝내기',
    },
  ];

  const problemFirstTurnOptions: CheckBoxDropDownOptions[] = [
    {
      selected: problemMakerInfo.firstTurn === 'BLACK',
      content: <div className='font-medium text-black text-16'>흑선</div>,
      value: 'BLACK',
    },
    {
      selected: problemMakerInfo.firstTurn === 'WHITE',
      content: <div className='font-medium text-black text-16'>백선</div>,
      value: 'WHITE',
    },
  ];
  const problemResultOptions: CheckBoxDropDownOptions[] = [
    {
      selected: problemMakerInfo.result === '살리는 문제',
      content: <div className='font-medium text-black text-16'>살리는 문제</div>,
      value: '살리는 문제',
    },
    {
      selected: problemMakerInfo.result === '죽이는 문제',
      content: <div className='font-medium text-black text-16'>죽이는 문제</div>,
      value: '죽이는 문제',
    },
    {
      selected: problemMakerInfo.result === '패',
      content: <div className='font-medium text-black text-16'>패</div>,
      value: '패',
    },
  ];
  return (
    <div className={cls('rounded-8 flex border-1 border-solid border-primary', props.className ?? '')}>
      <div className=' w-[25%] border-r border-solid border-primary'>
        <div className='bg-primary text-white text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary rounded-tl-6'>
          문제 유형
        </div>
        <CheckBoxDropDownSelect
          contents={<ProblemMakerInfoDropdownMenu title={problemMakerInfo.type} className=' rounded-bl-8' />}
          options={problemTypeOptions}
          selectHandler={(type: ProblemType) => setProblemMakerInfo((prev) => ({ ...prev, type }))}
          closeOnSelect
        />
      </div>
      <div className=' w-[25%] border-r border-solid border-primary'>
        <div className=' bg-bg_1 text-primary text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary'>
          레벨
        </div>
        <CheckBoxDropDownSelect
          contents={
            <ProblemMakerInfoDropdownMenu title={capitalize(problemMakerInfo.level)} className=' rounded-bl-8' />
          }
          options={problemLevelOptions}
          selectHandler={(level: Level) => setProblemMakerInfo((prev) => ({ ...prev, level }))}
          closeOnSelect
        />
      </div>
      <div className=' w-[25%] border-r border-solid border-primary'>
        <div className=' bg-primary text-white text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary'>
          차례
        </div>
        <CheckBoxDropDownSelect
          contents={
            <ProblemMakerInfoDropdownMenu
              title={problemMakerInfo.firstTurn === 'BLACK' ? '흑선' : '백선'}
              className=' rounded-bl-8'
            />
          }
          options={problemFirstTurnOptions}
          selectHandler={(stoneColor: StoneColor) => toggleFirstTurn(stoneColor)}
          closeOnSelect
        />
      </div>
      <div className=' w-[25%]'>
        <div className='bg-bg_1 text-primary text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary rounded-tr-8'>
          결과
        </div>
        <CheckBoxDropDownSelect
          contents={<ProblemMakerInfoDropdownMenu title={problemMakerInfo.result} className=' rounded-bl-8' />}
          options={problemResultOptions}
          selectHandler={(result: ProblemResult) => setProblemMakerInfo((prev) => ({ ...prev, result }))}
          closeOnSelect
        />
      </div>
    </div>
  );
}

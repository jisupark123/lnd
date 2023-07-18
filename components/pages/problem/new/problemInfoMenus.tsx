import DropDownMenu from '@/components/menu/drop-down-menu';
import React, { HTMLAttributes } from 'react';
import ProblemInfoDropdownMenu from './problemInfoDropdownMenu';
import CheckBoxDropDown, { CheckBoxDropDownMenu } from '@/components/menu/check-box_drop-down';
import capitalize from '@/libs/utils/capitalize';
import { ProblemInfo } from '@/pages/problem/new';
import { cls } from '@/libs/client/cls';
import { StoneColor } from '@/libs/domain/baduk/baduk';

interface Props extends HTMLAttributes<HTMLDivElement> {
  problemInfo: ProblemInfo;
  setProblemInfo: React.Dispatch<React.SetStateAction<ProblemInfo>>;
  toggleFirstTurn: (newFirstTurn: StoneColor) => void;
}

export default function ProblemInfoMenus({ problemInfo, setProblemInfo, toggleFirstTurn, ...props }: Props) {
  const problemTypeMenus: CheckBoxDropDownMenu[] = [
    {
      selected: problemInfo.type === '사활',
      content: <div className='font-medium text-black text-16'>사활</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, type: '사활' })),
    },
    {
      selected: problemInfo.type === '맥',
      content: <div className='font-medium text-black text-16'>맥</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, type: '맥' })),
    },
  ];
  const problemLevelMenus: CheckBoxDropDownMenu[] = [
    {
      selected: problemInfo.level === 'bronze',
      content: <div className='font-medium text-black text-16'>Bronze</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'bronze' })),
    },
    {
      selected: problemInfo.level === 'silver',
      content: <div className='font-medium text-black text-16'>Silver</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'silver' })),
    },
    {
      selected: problemInfo.level === 'gold',
      content: <div className='font-medium text-black text-16'>Gold</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'gold' })),
    },
    {
      selected: problemInfo.level === 'platinum',
      content: <div className='font-medium text-black text-16'>Platinum</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'platinum' })),
    },
    {
      selected: problemInfo.level === 'diamond',
      content: <div className='font-medium text-black text-16'>Diamond</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'diamond' })),
    },
    {
      selected: problemInfo.level === 'ruby',
      content: <div className='font-medium text-black text-16'>Ruby</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'ruby' })),
    },
    {
      selected: problemInfo.level === 'master',
      content: <div className='font-medium text-black text-16'>Master</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'master' })),
    },
  ];
  const problemFirstTurnMenus: CheckBoxDropDownMenu[] = [
    {
      selected: problemInfo.firstTurn === 'BLACK',
      content: <div className='font-medium text-black text-16'>흑선</div>,
      onSelect: () => toggleFirstTurn('BLACK'),
    },
    {
      selected: problemInfo.firstTurn === 'WHITE',
      content: <div className='font-medium text-black text-16'>백선</div>,
      onSelect: () => toggleFirstTurn('WHITE'),
    },
  ];
  const problemResultMenus: CheckBoxDropDownMenu[] = [
    {
      selected: problemInfo.result === '살리는 문제',
      content: <div className='font-medium text-black text-16'>살리는 문제</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, result: '살리는 문제' })),
    },
    {
      selected: problemInfo.result === '죽이는 문제',
      content: <div className='font-medium text-black text-16'>죽이는 문제</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, result: '죽이는 문제' })),
    },
    {
      selected: problemInfo.result === '패',
      content: <div className='font-medium text-black text-16'>패</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, result: '패' })),
    },
  ];
  return (
    <div className={cls('rounded-8 flex border-1 border-solid border-primary', props.className ?? '')}>
      <div className=' w-[25%] border-r border-solid border-primary'>
        <div className='bg-primary text-white text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary rounded-tl-6'>
          문제 유형
        </div>
        <DropDownMenu contents={<ProblemInfoDropdownMenu title={problemInfo.type} className=' rounded-bl-8' />}>
          <CheckBoxDropDown menus={problemTypeMenus} className='w-full top-10' />
        </DropDownMenu>
      </div>
      <div className=' w-[25%] border-r border-solid border-primary'>
        <div className=' bg-bg_1 text-primary text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary'>
          레벨
        </div>
        <DropDownMenu contents={<ProblemInfoDropdownMenu title={capitalize(problemInfo.level)} />}>
          <CheckBoxDropDown menus={problemLevelMenus} className='w-full top-10' />
        </DropDownMenu>
      </div>
      <div className=' w-[25%] border-r border-solid border-primary'>
        <div className=' bg-primary text-white text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary'>
          차례
        </div>
        <DropDownMenu
          contents={<ProblemInfoDropdownMenu title={problemInfo.firstTurn === 'BLACK' ? '흑선' : '백선'} />}
        >
          <CheckBoxDropDown menus={problemFirstTurnMenus} className='w-full top-10' />
        </DropDownMenu>
      </div>
      <div className=' w-[25%]'>
        <div className='bg-bg_1 text-primary text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary rounded-tr-8'>
          결과
        </div>
        <DropDownMenu contents={<ProblemInfoDropdownMenu title={problemInfo.result} className=' rounded-br-8' />}>
          <CheckBoxDropDown menus={problemResultMenus} className='w-full top-10' />
        </DropDownMenu>
      </div>
    </div>
  );
}

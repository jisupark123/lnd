import { cls } from '@/libs/client/cls';
import Image from 'next/image';
import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const ProblemInfoMenu: React.FC<Props> = ({ title, ...props }) => {
  return (
    <div
      className={cls(
        'h-50 flex justify-between items-center px-24 bg-white cursor-pointer select-none',
        props.className ?? '',
      )}
    >
      <div />
      <span className='font-bold text-primary text-16'>{title}</span>
      <Image src={'/icons/chevron-down.svg'} alt='메뉴 선택 버튼' width={12} height={6} />
    </div>
  );
};

export default ProblemInfoMenu;

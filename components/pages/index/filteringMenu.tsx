import { cls } from '@/libs/client/cls';
import Image from 'next/image';
import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const FilteringMenu: React.FC<Props> = ({ title, ...props }) => {
  return (
    <div
      className={cls(
        'h-50 flex justify-between items-center px-14 bg-white rounded-8 cursor-pointer select-none shadow-card',
        props.className ?? '',
      )}
    >
      <span className='font-bold text-primary text-16'>{title}</span>
      <Image src={'/icons/chevron-down.svg'} alt='메뉴 선택 버튼' width={10} height={6} />
    </div>
  );
};

export default FilteringMenu;

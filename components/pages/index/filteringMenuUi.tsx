import { cls } from '@/libs/client/cls';
import Image from 'next/image';
import React, { HTMLAttributes } from 'react';
import ChevronDown from '../../../public/icons/chevron-down.svg';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const FilteringMenuUi: React.FC<Props> = ({ title, ...props }) => {
  return (
    <div
      className={cls(
        'h-50 flex justify-between items-center px-14 bg-white rounded-8 cursor-pointer select-none shadow-card',
        props.className ?? '',
      )}
    >
      <span className='font-bold text-primary text-16'>{title}</span>
      <ChevronDown width='10' height='6' />
    </div>
  );
};

export default FilteringMenuUi;

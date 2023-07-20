import { cls } from '@/libs/client/cls';
import Image from 'next/image';
import React from 'react';
import CheckIcon from '../../public/icons/check.svg';

interface Props {
  checked: boolean;
  toggleFn: () => void;
}

const CheckBox: React.FC<Props> = ({ checked, toggleFn }) => {
  return (
    <div
      className={cls(
        'w-16 h-16 flex justify-center items-center rounded-3 border-[1.5px] border-solid border-primary select-none cursor-pointer',
        checked ? 'bg-primary' : 'bg-white',
      )}
      onClick={toggleFn}
    >
      <CheckIcon width='8' color='white' />
    </div>
  );
};

export default CheckBox;

import { cls } from '@/libs/client/cls';
import Image from 'next/image';
import React from 'react';

interface Props {
  checked: boolean;
  toggleFn: () => void;
}

const CheckBox: React.FC<Props> = ({ checked, toggleFn }) => {
  return (
    <div
      className={cls(
        'w-16 h-16 flex justify-center items-center rounded-3 border-[1.5px] border-solid border-main select-none cursor-pointer',
        checked ? 'bg-main' : 'bg-white',
      )}
      onClick={toggleFn}
    >
      <Image src={'/icons/check.svg'} alt='check' width={8} height={8} />
    </div>
  );
};

export default CheckBox;

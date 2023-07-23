import { cls } from '@/libs/client/cls';
import React, { HTMLAttributes, useEffect } from 'react';

export type DropDownMenuOption = {
  content: string | React.ReactNode;
  selectHandler: () => void;
};

interface Props extends HTMLAttributes<HTMLUListElement> {
  options: DropDownMenuOption[];
  closeDropDown: () => void;
}

export default function DropDownMenu({ options, closeDropDown, ...props }: Props) {
  useEffect(() => {
    document.body.addEventListener('click', closeDropDown);
    return () => {
      document.body.removeEventListener('click', closeDropDown);
    };
  });
  return (
    <ul className={cls('absolute shadow-neumorphism box-border bg-white rounded-4', props.className ?? '')}>
      {options.map((option, i) => (
        <li key={i}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              option.selectHandler();
            }}
            className={cls(
              'w-full flex justify-start py-12 px-16 text-14 text-gray_70 font-normal border-t-1 cursor-pointer hover:bg-[#EFEFEF]',
              i !== 0 ? ' border-t-gray_60' : ' border-t-white',
            )}
          >
            {option.content}
          </button>
        </li>
      ))}
    </ul>
  );
}

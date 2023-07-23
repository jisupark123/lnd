import React, { HTMLAttributes, useEffect, useState } from 'react';
import ChevronBottom from '../../public/icons/chevron_bottom.svg';
import { cls } from '@/libs/client/cls';
import DropDownOptions from './dropDownMenu';

export interface DropDownSelectOption {
  value: any;
  content: string | React.ReactNode;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: any;
  options: DropDownSelectOption[];
  selectHandler: (value: any) => void;
}

export default function DropDownSelect({ value, options, selectHandler, ...props }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const closeDropDown = () => setShowOptions(false);
  useEffect(() => {
    document.body.addEventListener('click', closeDropDown);
    return () => {
      document.body.removeEventListener('click', closeDropDown);
    };
  }, []);

  const handleOnClickMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation(); // body의 eventListener 적용 안되게
    setShowOptions((prev) => !prev);
  };
  return (
    <div className={props.className ?? ''}>
      <button
        onClick={handleOnClickMenu}
        className='w-full py-6 px-13 flex items-center justify-between text-14 font-normal text-black shadow-neumorphism rounded-4'
      >
        <span>{value}</span>
        <ChevronBottom width='16' height='16' />
      </button>
      {showOptions && (
        <div className='relative w-full'>
          <DropDownOptions
            className='top-10 left-0 w-full'
            options={options.map((option) => ({
              content: option.content,
              selectHandler: () => selectHandler(option.value),
            }))}
            closeDropDown={closeDropDown}
          />
        </div>
      )}
    </div>
  );
}

import { cls } from '@/libs/client/cls';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import CheckBox from '../check-box/check-box';

export interface CheckBoxDropDownOptions {
  selected: boolean;
  content: React.ReactNode;
  value: any;
}
interface Props extends HTMLAttributes<HTMLDivElement> {
  contents: React.ReactNode;
  options: CheckBoxDropDownOptions[];
  closeOnSelect?: boolean;
  selectHandler: (value: any) => void;
}

const CheckBoxDropDownSelect: React.FC<Props> = ({ contents, options, closeOnSelect, selectHandler, ...props }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  useEffect(() => {
    const closeDropDown = () => setShowDropDown(false);
    document.body.addEventListener('click', closeDropDown);
    return () => {
      document.body.removeEventListener('click', closeDropDown);
    };
  }, []);

  const handleOnClickSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // body의 eventListener 적용 안되게
    setShowDropDown((prev) => !prev);
  };
  const handleOnClickOption = (value: any) => {
    if (closeOnSelect) {
      setShowDropDown(false);
    }
    selectHandler(value);
  };
  return (
    <div>
      <div onClick={handleOnClickSelect} className={cls('shadow-shadow1', props.className ?? '')}>
        {contents}
      </div>
      <div className='relative'>
        {showDropDown && (
          <div
            className='absolute w-full top-10 flex flex-col gap-10 bg-white rounded-8 px-10 py-10 z-dropdown shadow-neumorphism'
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option, i) => (
              <div key={i} className='flex items-center gap-10'>
                <CheckBox checked={option.selected} toggleFn={() => handleOnClickOption(option.value)} />
                {option.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckBoxDropDownSelect;

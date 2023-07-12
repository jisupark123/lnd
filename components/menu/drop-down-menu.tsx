import React, { HTMLAttributes, useEffect, useState } from 'react';
import Image from 'next/image';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}

const DropDownMenu: React.FC<Props> = ({ title, children, ...props }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  useEffect(() => {
    const closeDropDown = () => setShowDropDown(false);
    document.body.addEventListener('click', closeDropDown);
    return () => {
      document.body.removeEventListener('click', closeDropDown);
    };
  }, []);

  const handleOnClickMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // body의 eventListener 적용 안되게
    setShowDropDown((prev) => !prev);
  };
  return (
    <div>
      <div
        style={{ ...props.style }}
        className='h-50 flex justify-between items-center px-14 bg-white rounded-8 cursor-pointer select-none'
        onClick={handleOnClickMenu}
      >
        <span className='text-16 font-bold text-main'>{title}</span>
        <Image src={'/icons/chevron-down.svg'} alt='레벨 선택 버튼' width={10} height={6} />
      </div>
      <div className='relative'>{showDropDown && children}</div>
    </div>
  );
};

export default DropDownMenu;

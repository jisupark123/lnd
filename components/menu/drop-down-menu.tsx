import React, { HTMLAttributes, useEffect, useState } from 'react';
import Image from 'next/image';
import { cls } from '@/libs/client/cls';

interface Props extends HTMLAttributes<HTMLDivElement> {
  contents: React.ReactNode;
  children: React.ReactNode;
}

const DropDownMenu: React.FC<Props> = ({ contents, children, ...props }) => {
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
      <div onClick={handleOnClickMenu}>{contents}</div>
      <div className='relative'>{showDropDown && children}</div>
    </div>
  );
};

export default DropDownMenu;

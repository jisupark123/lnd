import React, { HTMLAttributes } from 'react';
import CheckBox from '../check-box/check-box';
import { cls } from '@/libs/client/cls';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  menus: CheckBoxDropDownMenu[];
}

export interface CheckBoxDropDownMenu {
  selected: boolean;
  content: React.ReactNode;
  onSelect: () => void;
}

const CheckBoxDropDown: React.FC<Props> = ({ menus, ...props }) => {
  return (
    <div
      className={cls(
        'absolute flex flex-col gap-10 bg-white rounded-8 px-10 py-10 z-dropdown shadow-shadow2',
        props.className ?? '',
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {menus.map((menu, i) => (
        <div key={i} className='flex items-center gap-10'>
          <CheckBox checked={menu.selected} toggleFn={menu.onSelect} />
          {menu.content}
        </div>
      ))}
    </div>
  );
};

export default CheckBoxDropDown;

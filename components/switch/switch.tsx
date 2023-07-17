import { cls } from '@/libs/client/cls';
import React from 'react';
import styles from './switch.module.css';
import { ComponentSize } from '@/types/component-size';

interface Props {
  size: ComponentSize;
  isOn: boolean;
  toggleFn: () => void;
}

const Switch: React.FC<Props> = ({ size, isOn, toggleFn }) => {
  return (
    <div
      className={cls(
        'relative rounded-full box-border cursor-pointer select-none',
        size === 'big' ? 'w-34 p-3 h-20' : 'w-27 p-2 h-16',
        isOn ? styles['bg-on'] : styles['bg-off'],
      )}
      onClick={toggleFn}
    >
      <div
        className={cls(
          'absolute bg-white rounded-full',
          size === 'big' ? cls('w-14 h-14', styles['big']) : cls('w-12 h-12', styles['small']),
          isOn ? styles['btn-on'] : styles['btn-off'],
        )}
      />
    </div>
  );
};

export default Switch;

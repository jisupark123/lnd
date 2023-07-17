import { StoneColor } from '@/libs/domain/baduk/baduk';
import { cls } from '@/libs/client/cls';
import React from 'react';
import styles from './bw-switch.module.css';

interface Props {
  mode: StoneColor;
  toggleFn: () => void;
}

const BwSwitch: React.FC<Props> = ({ mode, toggleFn }) => {
  return (
    <div
      className={cls(
        'w-100 box-border rounded-full p-4 flex relative cursor-pointer select-none',
        mode === 'BLACK' ? styles['color-black'] : styles['color-white'],
      )}
      onClick={toggleFn}
    >
      <div
        className={cls(
          'w-24 h-24 rounded-full shrink-0 absolute',
          mode === 'BLACK' ? styles['move-black'] : styles['move-white'],
        )}
      ></div>
      {mode === 'BLACK' && <div className='w-24' />}
      <div className={cls('flex justify-center items-center w-full font-bold text-[16px]')}>
        {mode === 'BLACK' ? 'black' : 'white'}
      </div>
      {mode === 'WHITE' && <div className='w-24' />}
    </div>
  );
};

export default BwSwitch;

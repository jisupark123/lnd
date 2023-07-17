import { cls } from '@/libs/client/cls';
import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Underline: React.FC<Props> = ({ ...props }) => {
  return <div className={cls('w-full h-1', props.className ?? '')} style={{ background: 'rgba(0,0,0,0.2)' }}></div>;
};

export default Underline;

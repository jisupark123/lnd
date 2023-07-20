import { cls } from '@/libs/client/cls';
import React from 'react';

export type AlertActionStyle = 'primary' | 'destructive' | 'normal';

export interface AlertActionOptions {
  title: string;
  style: AlertActionStyle;
  handler: (() => void) | null;
}

interface AlertActionProps extends AlertActionOptions {
  closeAlert: () => void;
}

export default function AlertAction({ title, style, handler, closeAlert }: AlertActionProps) {
  const handleClickAction = () => {
    closeAlert();
    if (handler) {
      handler();
    }
  };
  return (
    <button
      className={cls(
        'py-6 px-12 rounded-4 text-white text-16',
        style === 'primary' ? 'bg-primary' : style === 'destructive' ? 'bg-danger' : 'bg-gray',
      )}
      onClick={handleClickAction}
    >
      {title}
    </button>
  );
}

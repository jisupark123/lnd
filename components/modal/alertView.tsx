import React from 'react';
import ModalView from './modalView';
import { cls } from '@/libs/client/cls';
import useAlert from '@/recoil/alert/useAlert';
import AlertAction from './alertAction';
import BackDrop from './backdrop';

export type AlertViewType = 'default' | 'destructive' | 'normal';

export default function AlertView() {
  const {
    alert: {
      show,
      alertOptions: { alertViewTitle, alertViewType, alertActions, closeWithTouchBackdrop },
    },
    closeAlert,
  } = useAlert();

  return (
    <>
      {show && (
        <BackDrop onBackdropClick={closeWithTouchBackdrop ? closeAlert : undefined}>
          <ModalView className=' w-full max-w-500 mx-20 box-border bg-white rounded-8'>
            <div
              className={cls(
                'p-16 font-semibold text-16 border-b-1 border-solid border-bg_1',
                alertViewType === 'default'
                  ? 'text-primary'
                  : alertViewType === 'destructive'
                  ? 'text-danger'
                  : 'text-gray_dark',
              )}
            >
              {alertViewTitle}
            </div>
            <div className='p-16 pt-24 flex justify-end items-end gap-10'>
              {alertActions.map((action, i) => (
                <AlertAction key={i} {...action} closeAlert={closeAlert} />
              ))}
            </div>
          </ModalView>
        </BackDrop>
      )}
    </>
  );
}

import { AlertActionOptions } from '@/components/modal/alertAction';
import { AlertViewType } from '@/components/modal/alertView';
import { atom } from 'recoil';

export type AlertOptions = {
  alertViewTitle: string;
  alertViewType: AlertViewType;
  alertActions: AlertActionOptions[];
  closeWithTouchBackdrop?: boolean;
};

type AlertStateType = {
  show: boolean;
  alertOptions: AlertOptions;
};

export const initialAlertState: AlertStateType = {
  show: false,
  alertOptions: {
    alertViewTitle: '',
    alertViewType: 'default',
    alertActions: [],
  },
};

export const alertState = atom({
  key: 'alertState',
  default: initialAlertState,
});

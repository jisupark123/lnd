import { AlertActionOptions } from '@/components/modal/alertAction';
import { AlertViewType } from '@/components/modal/alertView';
import { atom } from 'recoil';

export type AlertOptions = {
  alertViewTitle: string;
  alertViewDesc?: string;
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
    alertViewDesc: undefined,
    alertViewType: 'normal',
    alertActions: [],
  },
};

export const alertState = atom({
  key: 'alertState',
  default: initialAlertState,
});

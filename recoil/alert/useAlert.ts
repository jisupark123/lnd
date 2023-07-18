import { useRecoilState } from 'recoil';
import { AlertOptions, alertState, initialAlertState } from './atom';

export default function useAlert() {
  const [alert, setAlert] = useRecoilState(alertState);
  const showAlert = (alertOptions: AlertOptions) => {
    setAlert({
      show: true,
      alertOptions,
    });
  };
  const closeAlert = () => {
    setAlert(initialAlertState);
  };
  return { alert, showAlert, closeAlert };
}

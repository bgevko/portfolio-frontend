import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// redux
import { setErrorMessage, enterErrorActive, exitErrorActive, setConfirmMessage, enterConfirmActive, exitConfirmActive} from '../slices/appSlice';

const useNotification = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.app);

  const err = (message) => {
    dispatch(setErrorMessage(message));
    dispatch(enterErrorActive());
    setTimeout(() => {
      dispatch(exitErrorActive());
    }, appState.errorTimeout);
  };

  const confirm = (message) => {
    dispatch(setConfirmMessage(message));
    dispatch(enterConfirmActive());
    setTimeout(() => {
      dispatch(exitConfirmActive());
    }, appState.confirmTimeout);
  };

  useEffect(() => {
    if (appState.errorActive && appState.confirmActive) {
      dispatch(exitConfirmActive())
      setTimeout(() => { 
        if (appState.errorActive) dispatch(exitErrorActive())
        dispatch(enterConfirmActive())
        setTimeout(() => { dispatch(exitConfirmActive()) }, 3000)
      }, 4000)
    }
  }, [dispatch, appState.errorActive, appState.confirmActive])

  return { err, confirm };
}

export { useNotification };

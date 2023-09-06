import { useSelector, useDispatch } from 'react-redux';
import { useRef, useEffect } from 'react';

// redux
import { setDialogTitle, setDialogMessage, setDialogClosed, openDialog, closeDialog } from '../slices/appSlice';

const useDialog = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.app);
  const promiseRef = useRef({promise: null, resolve: null, reject: null});

  useEffect(() => {
    switch (state.dialogState) {
      case state.dialogStateOptions.CONFIRM:
        handleConfirm();
        break;
      case state.dialogStateOptions.CANCEL:
        handleCancel();
        break;
      default:
        break;
    }
  }, [state.dialogState])

  const createPromise = () => {
    const promise = new Promise((resolve, reject) => {
      promiseRef.current.resolve = resolve;
      promiseRef.current.reject = reject;
    });
    promiseRef.current.promise = promise;
    return promiseRef.current.promise;
  }

  const confirmAction = (title, message) => {
    dispatch(setDialogTitle(title));
    dispatch(setDialogMessage(message));
    dispatch(openDialog());
    return createPromise();
  };

  const handleCancel = () => {
    const resolve = promiseRef.current.resolve;
    if (resolve) {
      resolve(false);
      dispatch(setDialogClosed());
      dispatch(closeDialog())
    }
  }

  const handleConfirm = () => {
    const resolve = promiseRef.current.resolve;
    if (resolve) {
      resolve(true);
      dispatch(setDialogClosed());
      dispatch(closeDialog())
    }
  }

  return { confirmAction };
};

export { useDialog };

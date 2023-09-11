import {isRejectedWithValue} from '@reduxjs/toolkit'
import { enterErrorActive, exitErrorActive, setErrorMessage } from '../../slices/appSlice'

export const rtkQueryErrorLogger = (api) => (next) => (action) => {

  if (isRejectedWithValue(action)) {
    console.warn('Rejected action: ', action)

    const message = `${action.payload?.data?.error ?? action.payload?.error ?? action.error}`;
    const errorTimeout = 4000;
    api.dispatch(setErrorMessage(message ?? 'Something went wrong'));
    api.dispatch(enterErrorActive());

    setTimeout(() => {
      api.dispatch(exitErrorActive());
    }, errorTimeout);
  }

  return next(action)
}

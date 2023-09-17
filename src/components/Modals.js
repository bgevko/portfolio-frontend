
import React from 'react';
import { useSelector } from 'react-redux';
import { appSelector } from '../slices/appSlice'

import Dialog from './Dialog';
import { ErrorToast, ConfirmationToast } from './Toasts'

function Modals() {
  const appState = useSelector(appSelector)

  return (
    <>
      <ErrorToast active={appState.errorActive} message={appState.errorMessage} />
      <ConfirmationToast active={appState.confirmActive} message={appState.confirmMessage} />
      <Dialog active={appState.dialogOpen} />
    </>
  );
}

export default Modals;

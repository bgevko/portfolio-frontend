
import React from 'react';
import { useSelector } from 'react-redux';
import { appSelector } from '../slices/appSlice'

import ArticleForm from '../features/blog/ArticleForm';
import Dialog from './Dialog';
import { ErrorToast, ConfirmationToast } from './Toasts'

function Modals() {
  const appState = useSelector(appSelector)
  const articleFormState = useSelector(state => state.articleForm)

  return (
    <>
      <ErrorToast active={appState.errorActive} message={appState.errorMessage} />
      <ConfirmationToast active={appState.confirmActive} message={appState.confirmMessage} />
      <Dialog active={appState.dialogOpen} />
      <ArticleForm active={articleFormState.isOpen} />
    </>
  );
}

export default Modals;

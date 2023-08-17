
import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

const errorStyle = {
  width: '100%',
  height: 'fit-content',
  padding: '14px 16px',
  marginLeft: 'auto',
  background: '#B3261E',
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.30)',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '4px',
  display: 'inline-flex',
  zIndex: '999',
}

const errorText = {
  flex: '1 1 0',
  height: 'fit-content',
  width: "100%",
  color: 'rgba(245, 239, 247, 1)',
  fontSize: '14px',
  fontFamily: 'Roboto',
  fontWeight: '400',
  lineHeight: '20px',
  letterSpacing: '0.25px',
  wordWrap: 'break-word'
}

const confirmationStyle = {
  ...errorStyle,
  background: '#322F35',
  color: 'var(--theme-light',
  fontWeight: '600'
}

const confirmationText = {
  ...errorText, 
  color: '067647'
}

const ErrorToast = ({ message, active }) => {
  const errorRef = useRef(null);
  const ErrorComponent = (
    <div
      ref={errorRef}
      className='toast-notification' 
      style={errorStyle} 
      role="alert">
      <p style={errorText}>{message}</p>
    </div>
  );
  
  return (
    <CSSTransition
        in={active}
        nodeRef={errorRef}
        timeout={200}
        classNames="fade"
        unmountOnExit
        appear
      >
        {ErrorComponent}
      </CSSTransition>
  );
  

}

const ConfirmationToast = ({ message, active }) => {
  const confirmationRef = useRef(null);
  const ConfirmationComponent = (
    <div
      ref={confirmationRef}
      className='toast-notification' 
      style={confirmationStyle} 
      role="alert">
      <p style={confirmationText}>{message}</p>
    </div>
  );
  
  return (
    <CSSTransition
        in={active}
        nodeRef={confirmationRef}
        timeout={200}
        classNames="fade"
        unmountOnExit
        appear
      >
        {ConfirmationComponent}
      </CSSTransition>
  );
}

export { ErrorToast, ConfirmationToast };

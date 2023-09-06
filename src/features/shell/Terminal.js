import React from 'react';
import adminIcon from '../../icons/terminal-icon.svg';
import { showShell } from '../../slices/shellSlice';
import { useDispatch } from 'react-redux';

function Terminal() {
  const dispatch = useDispatch()
  const buttonPos = {
    position: 'absolute',
    top: '50px',
    left: '40px',
    zIndex: '-1'
  }

  return (
    <>
      <button style={buttonPos} type="button" aria-label="Admin terminal" onClick={() => {dispatch(showShell())}}>
        <img src={adminIcon} alt="admin icon" />
        <p style={{color: 'white'}}>Terminal</p>
      </button>
    </>
  )
}

export default Terminal;
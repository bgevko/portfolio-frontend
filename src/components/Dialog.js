import React, {useRef, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import ScrimOverlay from '../components/ScrimOverlay'

import { setDialogConfirmed, setDialogCancelled } from '../slices/appSlice';
function Dialog({ active }) {
  const dialogRef = useRef(null);
  const state = useSelector(state => state.app);
  const dispatch = useDispatch();

  const handleCancel = () => {
    dispatch(setDialogCancelled())
  }

  const handleConfirm = () => {
    dispatch(setDialogConfirmed())
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  useEffect(() => {
    if (state.dialogOpen) {
      dialogRef.current.focus();
    }
  }, [state.dialogOpen])

  const dialogBox = (
    <div 
      ref={dialogRef}
      tabIndex='-1'
      onKeyDown={handleKeyPress}
      className="dialog" 
      role="dialog" 
      aria-label="Confirm your action" 
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '200px',
        background: 'var(--theme-lightest)',
        zIndex: '103',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '24px',
      }}>

      <h3
        style={{
          margin: '0',
          marginBottom: '16px',
          fontSize: '24px',
          fontWeight: '400',
          fontFamily: 'Roboto, sans-serif',
          lineHeight: '32px'
        }}>
          {state.dialogTitle}
      </h3>

      <p
        style={{
          margin: '0',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '20px',
          fontFamily: 'Roboto, sans-serif',
          letterSpacing: '0.25px'
        }}>
          {state.dialogMessage}
        </p>
      <span style={{
        height: '40px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 'auto'
      }}>
        <button className='dialog-btn' id="cancel-btn" onClick={handleCancel}>CANCEL</button>
        <button className='dialog-btn' id="confirm-btn" onClick={handleConfirm}>PROCEED</button>
      </span>
    </div>
  )
  return (
    <>
    <ScrimOverlay active={active} handleClick={() => {} } zValue='102' />
      <CSSTransition
        in={active}
        nodeRef={dialogRef}
        timeout={100}
        classNames="fade"
        unmountOnExit
        appear
      >
        {dialogBox}
      </CSSTransition>
    </>
  )
}
export default Dialog;
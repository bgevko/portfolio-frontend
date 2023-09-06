import React, { useState, useRef, useEffect, Fragment } from 'react';
import { CSSTransition } from 'react-transition-group';
import ResizableWindow from '../../components/ResizableWindow';
import {useShellCommands} from '../../hooks/useShellCommands';

import { useSelector, useDispatch } from 'react-redux';
import { setColorMapValid, setColorMapInvalid, setColorMapArg, setArgMode, setCommandPrefix, enterFocus, exitFocus, enterIdle, exitIdle, updateCommandIndex, hideCaret, showCaret, appendInputPrefix, setInputPrefix, setProcessingMessage, shellSelector, hideShell } from '../../slices/shellSlice';

function Shell() {
  const shellRef = useRef(null)
  const {commandTrie, processInput } = useShellCommands()
  const state = useSelector(shellSelector)
  const dispatch = useDispatch()

  const handleShellClick = () => {
    shellRef.current.focus()
  }

  const handleFocus = () => {
    dispatch(enterFocus())
  }

  const handleBlur = () => {
    dispatch(exitFocus())
  }

  const handleKeyDown = (e) => {
    processInput(e, shellRef)
  }
  
  return (
    <>
    <CSSTransition
      in={state.visible}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <ResizableWindow
        id="shell"
        zValue='2'
        style={{
          height: `${state.shellHeight}px`,
          width: `${state.shellWidth}px`,
        }}
      >
          <span id="shell-header">
            <button type="button" id="shell-close-btn" aria-label="close shell" onClick={() => {dispatch(hideShell())}}></button>
            <p id="shell-header-text">bgevko.com</p>
          </span>
          <div 
            id="shell-content" 
            ref={shellRef} 
            tabIndex='0' 
            onClick={handleShellClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...state.focused && {onKeyDown: (e) => {handleKeyDown(e)}}}
          >
            {state.history.map((item, index) => (
              <Fragment key={index}>
                <CSSTransition
                  in={true}
                  appear={true}
                  timeout={300}
                  classNames="fade"
                >
                <p className={`${item.color}`}>{item.text}</p>
                </CSSTransition>
              </Fragment>
            ))}

            <span className="shell-line">
              <p className="shell-input">
                <span className={state.inputPrefixColor}>{state.inputPrefix}</span>
                {
                  state.input.map((char, index) => (<span key={index}>{char}</span>))
                }
              </p>
            </span>
          </div>
      </ResizableWindow>
    </CSSTransition>
  </>
  )
}


export default Shell;
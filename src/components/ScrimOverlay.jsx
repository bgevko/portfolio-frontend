import React, {useRef} from 'react';
import { CSSTransition } from 'react-transition-group';

function ScrimOverlay( {active, handleClick, zValue} ) {
  const nodeRef = useRef(null);

  return (
    <>
      <CSSTransition
        in={active}
        nodeRef={nodeRef}
        timeout={200}
        classNames="fade"
        unmountOnExit
        appear
      >
        <div ref={nodeRef} id="scrim-overlay" onClick={handleClick} style={{zIndex: `${zValue}`}}></div>
      </CSSTransition>
    </>
  )
}
export default ScrimOverlay;
import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

function Loading() {

  const loadRef = useRef(null);
  return (
    <CSSTransition
        in={true}
        nodeRef={loadRef}
        timeout={300}
        classNames="fade"
        unmountOnExit
        appear
      >
      <p>Loading...</p>
    </CSSTransition>
  )
}

export default Loading;
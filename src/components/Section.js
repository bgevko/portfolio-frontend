import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

function Section({ id, children}) {

  const sectionRef = useRef(null);
  return (
    <CSSTransition
        in={true}
        nodeRef={sectionRef}
        timeout={600}
        classNames="section"
        unmountOnExit
        appear
      >
      <section id={id} ref={sectionRef}>
        {children}
      </section>
    </CSSTransition>
  )
}

export default Section;
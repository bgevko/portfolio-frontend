import React from 'react';

const headedlineStyle = {
  backgroundColor: 'var(--theme-lightest)',
  border: 'var(--1px-border)',
  padding: 'var(--dynamic-padding)',
  fontSize: '1rem',
  width: 'fit-content',
  position: 'absolute',
  bottom: '-20px',
}

function MoreContent({ section_id, section_title, children }) {
  return (
    <>
      <section id={section_id}>
        <span><h4 style={headedlineStyle}>{section_title}</h4></span>
        {children}
      </section>
    </>
  );
}

export default MoreContent;
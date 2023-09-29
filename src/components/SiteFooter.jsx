import React, { useEffect, useRef } from 'react';

function SiteFooter({ children }) {
  useEffect(() => {
    let lastScrollTop = 0;

    const onScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const fromBottom = docHeight - winHeight - scrollTop;

        if (footerRef.current) {  // Ensure the ref is available
            if (scrollTop > lastScrollTop && fromBottom > 100) {
                footerRef.current.style.bottom = "-100px";
            } else {
                footerRef.current.style.bottom = "0";
            }
        }
        
        lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener('scroll', onScroll, { passive: true });
}, []); 

  const footerRef = useRef(null);
  return (
    <footer ref={footerRef}>
      {children}
      <p>&copy; Bogdan Gevko 2023</p>
  </footer>
  );
}

export default SiteFooter;

import React from 'react';
import { NavLink } from 'react-router-dom';

// Change the function names and links
// to fit your portfolio topic.

function MainNav() {
  return (
    <nav className='main-nav'>
        <NavLink to="/">home</NavLink>
        <NavLink to="/blog">blog</NavLink>
        <NavLink to="/projects">projects</NavLink>
        <NavLink to="/contact">contact</NavLink>
    </nav>
  );
}

export default MainNav;

import React from 'react';
import { NavLink } from 'react-router-dom';

// Change the function names and links
// to fit your portfolio topic.

function MainNav() {
  return (
    <nav className='main-nav'>
        <NavLink to="/">home</NavLink>
        <NavLink to="/blog">blog</NavLink>
        <NavLink to="/contact">contact</NavLink>
        <NavLink to="/order">order</NavLink>
        <NavLink to="/gallery">gallery</NavLink>
    </nav>
  );
}

export default MainNav;

import React from 'react';
import { NavLink } from 'react-router-dom';

import home_icon from '../icons/home-icon.svg'
import blog_icon from '../icons/blog-icon.svg'
import contact_icon from '../icons/contact-icon.svg'
import order_icon from '../icons/order-icon.svg'
import gallery_icon from '../icons/gallery-icon.svg'

// Change the function names and links
// to fit your portfolio topic.

function MobileNav() {
  return (
    <nav id='mobile-nav'>
      <NavLink to="/" aria-label="Link to home page">
        <img src={home_icon} alt="home icon mobile" />
      </NavLink>
      <NavLink to="/blog" aria-label="Link to blog page">
        <img src={blog_icon} alt="blog icon mobile" />
      </NavLink>
      <NavLink to="/contact" aria-label="Link to contact page">
        <img src={contact_icon} alt="contact icon mobile" />
      </NavLink>
      <NavLink to="/order" aria-label="Link to order page">
        <img src={order_icon} alt="order icon mobile" />
      </NavLink>
      <NavLink to="/gallery" aria-label="Link to gallery page">
        <img src={gallery_icon} alt="gallery icon mobile" />
      </NavLink>
    </nav>
  );
}

export default MobileNav;

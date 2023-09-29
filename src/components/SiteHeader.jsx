import React from 'react';
import { useNavigate } from 'react-router-dom';

import lock_icon from '../icons/lock-icon.svg'
import back_icon from '../icons/back-icon.svg'
import fwd_icon from '../icons/fwd-icon.svg'
import refresh_icon from '../icons/refresh-icon.svg'
import github_icon from '../icons/github-icon.svg'
import linkedin_icon from '../icons/linkedin-icon.svg'

function SiteHeader({ children }) {

  const navigate = useNavigate();

  const handlePrev = () => {
    navigate(-1);
  }

  const handleNext = () => {
    navigate(1);
  }

  const handleRefresh = () => {
    navigate(0);
  }

  return (
    <header id='site-header'>
      <span className="site-banner-items">
        <nav className='browser-btn-nav'>
          <button aria-label="Button to go back to previous page" id="prev-btn" onClick={handlePrev}>
            <img src={back_icon} alt="back icon" />
          </button>
          <button aria-label="Button to go to the next page" id="next-btn" onClick={handleNext}>
            <img src={fwd_icon} alt="forward icon" />
          </button>
          <button aria-label="Button to refresh page" id="refresh-btn" onClick={handleRefresh}>
            <img src={refresh_icon} alt="refresh icon" />
          </button>
        </nav>

        <span className="site-name-textbox">
          <img src={lock_icon} alt="Lock Icon" id="lock-icon" />
          <h1>Bogdan Gevko</h1>
        </span>

        <nav className='socials-nav'>
          <a aria-label="Bogdan's Github" id="github-link" href="https://github.com/bgevko" target="_blank" rel="noopener noreferrer">
            <img src={github_icon} alt="github icon" />
          </a>
          <a aria-label="Bogdan's LinkedIn" id="linkedin-link"href="https://www.linkedin.com/in/bogdan-gevko-3a0796113" target="_blank" rel="noopener noreferrer">
            <img src={linkedin_icon} alt="linkedin icon" />
          </a>
        </nav>
      </span>
      {children}
    </header>
  );
}

export default SiteHeader;

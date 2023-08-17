import React, { useState, useContext, useEffect } from 'react';
import chevron from '../icons/chevron.svg';
import { GlobalContext } from '../GlobalContext';
import placeholder from '../images/media.png';

const Card = ({photo, index, title, subtitle, content, actionLabel, actionUrl}) => {

  const photo_source = photo || placeholder
  const [isExpanded, setIsExpanded] = useState(false);
  const { openCard, setOpenCard } = useContext(GlobalContext);

  const chevronUpStyle = {
    transform: 'rotate(180deg)'
  }

  const collapsedStyle = {
    maxHeight: '0px',
    overflow: 'hidden',
    transition: 'max-height .5s'
  }

  const dynamicHeight = content.length / 1.9;
  // set max height based on content length
  const maxHeight = `${dynamicHeight > 50 ? dynamicHeight : 50}px`

  const expandedStyle = {
    maxHeight: maxHeight,
    overflow: 'hidden',
    transition: 'max-height .5s'
  }

  function handleExpand() {
    if (!isExpanded) {
      setOpenCard(index)
      setIsExpanded(!isExpanded)
    } else {
      setOpenCard(null)
      setIsExpanded(!isExpanded)
    }
  }

  function handleActionClick() {
    window.open(actionUrl, '_blank')
  }

  useEffect (() => {
    if (openCard !== index) {
      setIsExpanded(false)
    }
  }, [openCard])

  return (
    <div className="card">
      <img className="card-media" src={photo_source} alt="Card Photo" />
      <span className="card-title">
        <h3>{title}</h3>
        <button className="chevron-button" onClick={handleExpand}>
          <img src={chevron} alt="chevron icon" style={!isExpanded ? chevronUpStyle : {}}/>
        </button>
      </span>
      {subtitle && <h4 className="card-subtitle">{subtitle}</h4>}
      <p className="card-text" style={!isExpanded ? collapsedStyle : expandedStyle}>{content}</p>
      {
        actionLabel && 
        <span className="card-action" style={!isExpanded ? collapsedStyle : expandedStyle}>
          <button className="card-action-btn" style={!isExpanded ? collapsedStyle : expandedStyle} onClick={handleActionClick} aria-label="Open project url">
            {actionLabel}
          </button>
        </span>}
    </div>
  )
};
export default Card;
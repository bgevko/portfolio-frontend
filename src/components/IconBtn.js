import React from 'react';
import edit_icon from '../icons/edit-icon.svg';
import delete_icon from '../icons/delete-icon.svg';

function IconBtn( {type, action} ) {
  let icon
  let ariaLabel
  if (type === 'edit') {
    icon = edit_icon;
    ariaLabel = 'Edit blog post.';
  } else if (type === 'delete') {
    icon = delete_icon;
    ariaLabel = 'Delete blog post.';
  } else {
    throw new Error('Invalid icon type.');
  }
  return (
    <button type="button" className={`icon-btn ${type}-icon-btn`} aria-label={ariaLabel} onClick={action}>
      <img src={icon} alt="edit icon" />
    </button>
  )
}
export default IconBtn;
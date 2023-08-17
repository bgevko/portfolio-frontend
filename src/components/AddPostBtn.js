import React from 'react';
import plusIcon from '../icons/plus-icon.svg';

function AddPostBtn({ setFormOpen }) {
  
  const handleAddPostClick = () => {
    setFormOpen(true)
  }

  return (
    <button className="add-post-btn" aria-label="Add new blog post." onClick={handleAddPostClick}>
      <img src={plusIcon} alt="plus icon" />
        <p>New Post</p>
    </button>
  )
}
export default AddPostBtn;
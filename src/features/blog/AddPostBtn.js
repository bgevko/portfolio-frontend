import React from 'react';
import plusIcon from '../../icons/plus-icon.svg'
import { setFormOpen, initializeBlankForm } from '../../slices/articleFormSlice';
import { useDispatch } from 'react-redux';

function AddPostBtn() {
  const dispatch = useDispatch()
  
  const handleAddPostClick = () => {
    dispatch(initializeBlankForm())
    dispatch(setFormOpen(true))
    
  }

  return (
    <button className="add-post-btn" aria-label="Add new blog post." onClick={handleAddPostClick}>
      <img src={plusIcon} alt="plus icon" />
        <p>New Post</p>
    </button>
  )
}
export default AddPostBtn;
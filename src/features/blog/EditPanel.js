import React from 'react';
import edit_icon from '../../icons/edit-icon.svg';
import delete_icon from '../../icons/delete-icon.svg';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setFormOpen, initializePrefilledForm } from '../../slices/articleFormSlice';
import { useDeleteArticleMutation } from '../../slices/blogApiSlice';
import { useDialog } from '../../hooks/useDialog';

function EditPanel({article, setIsVisible}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { confirmAction } = useDialog();
  const [deleteArticle, { isLoading, isSuccess }] = useDeleteArticleMutation()

  function handleEdit() {
    dispatch(initializePrefilledForm(article))
    dispatch(setFormOpen(true))
  }

  async function handleDelete() {
    const confirmed = await confirmAction('Delete article?', 'Are you sure you want to delete this article?')
    if (confirmed) {
      setIsVisible(false)
      try {
        await deleteArticle(article).unwrap();
        navigate('/blog')
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <span className="article-edit-btns">
      <button type="button" className='icon-btn edit-icon-btn' aria-label='Edit blog post' onClick={handleEdit}>
        <img src={edit_icon} alt="edit icon" />
      </button>
      <button type="button" className='icon-btn delete-icon-btn' aria-label='Delete blog post' onClick={handleDelete}>
        <img src={delete_icon} alt="delete icon" />
      </button>
    </span>
  )
}

export default EditPanel;
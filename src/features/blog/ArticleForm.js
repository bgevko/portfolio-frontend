import React, { useRef, useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { useDialog } from '../../hooks/useDialog';

import { setFormOpen, setTitle, setAuthor, setPublishDate, setPreview, setContent, setTags } from '../../slices/articleFormSlice';
import { useAddArticleMutation, useUpdateArticleMutation } from '../../slices/blogApiSlice';

import ScrimOverlay from '../../components/ScrimOverlay'

function ArticleForm({active}) {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const form = useSelector(state => state.articleForm)
  const dispatch = useDispatch();
  const { confirmAction } = useDialog();

  const [addNewArticle, { isLoading, isSuccess }] = useAddArticleMutation()
  const [updateArticle, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] = useUpdateArticleMutation()
  
  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    const article = {
      _id: form._id,
      title: form.title,
      author: form.author,
      publishDate: form.publishDate,
      preview: form.preview,
      content: form.content,
      tags: form.tags.split(',').map(tag => tag.trim())
    }
    if (form.status === 'blank') {
      try {
        await addNewArticle(article).unwrap();
        dispatch(setFormOpen(false))
      } catch (err) {
        console.log(err)
      }
    } else if (form.status === 'prefilled') {
      try {
        await updateArticle(article).unwrap();
        dispatch(setFormOpen(false))
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleCloseForm = async() => {
    if (!form.unsavedChanges) {
      dispatch(setFormOpen(false))
    } else {
      const confirmed = await confirmAction('Unsaved changes', 'Are you sure you want to close this form? Any unsaved changes will be lost.')
      if (confirmed) {
        dispatch(setFormOpen(false))
      }
    }
  }

  // Call closeFormPrompt when user presses escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCloseForm();
    }
  }

  const formComponent = (
    <>
    <form 
      ref={formRef}
      tabIndex='0'
      onSubmit={handleSubmitArticle}
      onKeyDown={handleKeyDown}
      id='article-form'
    >
        <fieldset
          style={{}}
        >
            <label htmlFor="article-title">Article Title</label>
            <input
                ref={inputRef}
                type="text"
                autoFocus
                placeholder="Article Title"
                size="30"
                maxLength="100"
                id="article-title"
                name="article-title"
                value={form.title}
                onChange={(e) => dispatch(setTitle(e.target.value))}
                required
            />

            <label htmlFor="author">Author</label>
            <input
                type="text"
                placeholder="Author"
                size="30"
                maxLength="100"
                id="author"
                name="author"
                value={form.author}
                onChange={(e) => dispatch(setAuthor(e.target.value))}
                required
            />

            <label htmlFor="publish-date">Publish Date</label>
            <input
                type="date"
                size="30"
                maxLength="100"
                id="publish-date"
                name="publish-date"
                value={form.publishDate}
                onChange={(e) => dispatch(setPublishDate(e.target.value))}
                required
            />

            <label htmlFor="article-preview">Article Preview</label>
            <textarea
                placeholder="Brief summary of article"
                maxLength="500"
                id="article-preview"
                name="article-preview"
                value={form.preview}
                onChange={(e) => dispatch(setPreview(e.target.value))}
                required
            ></textarea>

            <label htmlFor="article-content">Article Content</label>
            <textarea
                placeholder="Main article content.."
                id="article-content"
                name="article-content"
                required
                value={form.content}
                onChange={(e) => dispatch(setContent(e.target.value))}
            ></textarea>

            <label htmlFor="article-tags">Article Tags</label>
            <input
              type="text"
              placeholder="Article Tags"
              size="30"
              maxLength="100"
              id="article-tags"
              name="article-tags"
              value={form.tags}
              onChange={(e) => dispatch(setTags(e.target.value))}
              required
            />
        </fieldset>

        <span className='dialog-form-btns'>
          <button type="button" aria-label='close article form' id='article-cancel-btn' onClick={handleCloseForm}>Cancel</button>
          <button type='submit'id='article-submit-btn'>Submit</button>
        </span>
    </form>
    </>
  )

  return (
    <>
      <ScrimOverlay active={active} handleClick={handleCloseForm} zValue='100'/>
      <CSSTransition
        in={active}
        nodeRef={formRef}
        timeout={250}
        classNames="slide"
        unmountOnExit
        appear
      >
        {formComponent}
      </CSSTransition>
    </>
  )
}
export default ArticleForm;
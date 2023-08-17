import React, { useState, useRef, useEffect, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import ScrimOverlay from '../components/ScrimOverlay'
import Dialog from '../components/Dialog'
import { CSSTransition } from 'react-transition-group';

function BlogForm({ formOpen, setFormOpen, article}) {
  const today = new Date().toISOString().split('T')[0];

  // Convert article date to YYYY-MM-DD format
  const articleDate = article ? new Date(article.publishDate).toISOString().split('T')[0] : today;

  const [articleTitle, setArticleTitle] = useState((article && article.title) || '');
  const [author, setAuthor] = useState((article && article.author) || '');
  const [publishDate, setPublishDate] = useState((article && articleDate) || today);
  const [preview, setPreview] = useState((article && article.preview) || '');
  const [content, setContent] = useState((article && article.content) || '');
  const [tags, setTags] = useState((article && article.tags.join(',').replaceAll(',', ', ')) || '');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogResponse, setDialogResponse] = useState(null)

  const editMode = article ? true : false;

  const formRef = useRef(null);
  const inputRef = useRef(null);

  const { updateBlog, setErrorActive, setErrorMessage, setConfirmActive, setConfirmMessage } = useContext(GlobalContext)

  useEffect(() => {
    if (formOpen) {
      setArticleTitle(article ? article.title : '');
      setAuthor(article ? article.author : '');
      setPublishDate(article ? articleDate : today);
      setPreview(article ? article.preview : '');
      setContent(article ? article.content : '');
      setTags(article ? article.tags.join(', ').replaceAll(',', ', ') : '');
    }
  }, [article, formOpen])

  const handleSubmitArticle = async (e) => {
    e.preventDefault();

    const formData = {
      title: articleTitle,
      author: author,
      publishDate: publishDate,
      preview: preview,
      content: content,
      tags: tags
    }

    // If not in edit mode, send POST request to create new article
    if (!editMode) {
      const response = await fetch('/blog', {
          method: 'post',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        // Use json data from response to update blog state
        const newArticle = await response.json();
        updateBlog(prevState => [newArticle, ...prevState]);
        setFormOpen(false);
        resetForm();
        setTimeout(() => {
          setConfirmMessage('Article created.');
          setConfirmActive(true);
          setTimeout(() => { setConfirmActive(false) }, 3000);
        }, 300)
      } else {
          const statusCode = response.status;
          const errorMessage = await response.text();
          setErrorMessage(`Error ${statusCode}: ${errorMessage}`);
          setErrorActive(true);
          setTimeout(() => { setErrorActive(false) }, 4000);
      }
    } 
    
    // If in edit mode, send PUT request to update existing article
    else {
      console.log(formData)
      const response = await fetch(`/blog/${article?._id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        // Use json data from response to update blog state
        const updatedArticle = await response.json();
        updateBlog(prevState => prevState.map(item => {
          if (item._id === updatedArticle._id) {
            return updatedArticle;
          }
          return item;
        }));
        setFormOpen(false);
        resetForm();
        setTimeout(() => {
          setConfirmMessage('Article updated.');
          setConfirmActive(true);
          setTimeout(() => { setConfirmActive(false) }, 3000);
        }, 300)

      } else {
        const statusCode = response.status;
        const errorMessage = await response.text();
        setErrorMessage(`Error ${statusCode}: ${errorMessage}`);
        setErrorActive(true);
        setTimeout(() => { setErrorActive(false) }, 4000);
      }
    }
  }

  const handleCloseForm = () => {
    if (allFieldsDefault()) {
      setFormOpen(false);
      return;
    }
    setDialogOpen(true);
  }
  
  const allFieldsDefault = () => {
    if (
      articleTitle === '' && 
      author === '' && 
      publishDate === today && 
      preview === '' && 
      content === '' && 
      tags === '') {
      return true;
    } else if (
      article && articleTitle === article.title &&
      article && author === article.author &&
      article && publishDate === articleDate &&
      article && preview === article.preview &&
      article && content === article.content &&
      // remove spaces from tags and article.tags and compare
      article && tags.replaceAll(' ', '') === article.tags.join(',').replaceAll(' ', '')
    ) {
      return true;
    } else {
      return false;
    }
  }

  const resetForm = () => {
    setArticleTitle(article ? article.title : '');
    setAuthor(article ? article.author : '');
    setPublishDate(article ? articleDate : today);
    setPreview(article ? article.preview : '');
    setContent(article ? article.content : '');
    setTags(article ? article.tags.join(', ') : '');
  }

  // Call closeFormPrompt when user presses escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCloseForm();
    }
  }

  useEffect(() => {
    if (dialogResponse === true) {
      setFormOpen(false);
      setDialogOpen(false);
      setDialogResponse(null);
      resetForm();
    }
    if (dialogResponse === false) {
      setDialogOpen(false);
      setDialogResponse(null);
      inputRef.current.focus();
    }
  }, [dialogResponse])

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
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
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
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
            />

            <label htmlFor="publish-date">Publish Date</label>
            <input
                type="date"
                size="30"
                maxLength="100"
                id="publish-date"
                name="publish-date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
            />

            <label htmlFor="article-preview">Article Preview</label>
            <textarea
                placeholder="Supports markdown **bold** *italic* # h1, etc."
                maxLength="500"
                id="article-preview"
                name="article-preview"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                required
            ></textarea>

            <label htmlFor="article-content">Article Content</label>
            <textarea
                placeholder="Also supports markdown"
                id="article-content"
                name="article-content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <label htmlFor="article-tags">Article Tags</label>
            <input
              type="text"
              placeholder="Article Tags"
              size="30"
              maxLength="100"
              id="article-tags"
              name="article-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
      <ScrimOverlay active={formOpen} handleClick={handleCloseForm} zValue='100'/>
      <CSSTransition
        in={formOpen}
        nodeRef={formRef}
        timeout={250}
        classNames="slide"
        unmountOnExit
        appear
      >
        {formComponent}
      </CSSTransition>
      <Dialog 
        title='Close the form?'
        message='All form progress will be lost. Continue?'
        active={dialogOpen}
        setResponse={setDialogResponse}
      />
    </>
  )
}
export default BlogForm;
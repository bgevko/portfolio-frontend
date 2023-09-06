import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl } from '../config';

import { useNotification } from './useNotification';

// redux
import { setBlog, setLatestArticle, removeArticleById, addArticle, closeForm, enterBlogLoading, exitBlogLoading, setArticleVisible } from '../slices/blogSliceOld';

const useBlog = () => {
  const dispatch = useDispatch();
  const blogState = useSelector(state => state.blog);

  const { error, confirm } = useNotification();

  // GET BLOG 
  const getBlog = useCallback(async () => {
    try {
      dispatch(enterBlogLoading())
      const response = await fetch(`${baseUrl}/blog`)
      const data = await response.json()
    
      if (response.ok) {
        dispatch(dispatch(setBlog(data)))
        
      } else {
        error('Error connecting to the server')
      }
      dispatch(exitBlogLoading())
      } catch (err) {
        error('Error connecting to the server')
      }
    }, [baseUrl])
  
  // GET LATEST ARTICLE
  const getLatestArticle = useCallback(async() => {
    try {
      const response = await fetch(`${baseUrl}/blog/latest`)
      const data = await response.json()
      if (response.ok) {
        dispatch(setLatestArticle(data))
      } else {
        error(`${response.status} error: ${data.error}`);
      } 
    } catch (err) {
        error(`Error: ${err}`)
      }
  }, [baseUrl])
  

  // DELETE ARTICLE
  const deleteArticle = async(article_id) => {
    // if (!appState.isAdmin) return error('You must be logged in as an admin to delete articles.');

    const response = await fetch(`${baseUrl}/blog/${article_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      dispatch(setArticleVisible(article_id, false))
      confirm('Article deleted.');
      dispatch(closeForm())

      // Give the component time to animate out
      setTimeout(() => {
        dispatch(removeArticleById(article_id))
      }, 500);

    } else {
      // get error message from response body or default to response status
      const data = await response.json()
      error(`${response.status} error: ${data.error}`);
    }
  }

  // CREATE ARTICLE
  const createArticle = async(formData) => {
    const response = await fetch(baseUrl + '/blog', {
      method: 'post',
      body: JSON.stringify(formData),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
      }
    });

    if (response.status === 201) {
      const newArticle = await response.json();
      dispatch(setArticleVisible(newArticle._id, false))
      dispatch(addArticle(newArticle));
      dispatch(closeForm())
      setTimeout(() => {
        confirm('Article created.');
        dispatch(setArticleVisible(newArticle._id, true))
      }, 500)
    } else {
        const statusCode = response.status;
        const errorMessage = await response.json()
        error(`Error ${statusCode}: ${errorMessage.error}`);
    }
  }

  // UPDATE ARTICLE
  const updateArticle = async(formData, article) => {
    const response = await fetch(`${baseUrl}/blog/${article?._id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
      }
    });

    if (response.status === 200) {
      // Use json data from response to update blog state
      const updatedArticle = await response.json();
      dispatch(updateArticle(updatedArticle))
      dispatch(closeForm())
      setTimeout(() => {
        confirm('Article updated.');
      }, 300)

    } else {
      const statusCode = response.status;
      const errorMessage = await response.json();
      error(`Error ${statusCode}: ${errorMessage.error}`);
    }
  }

  return { getBlog, deleteArticle, getLatestArticle, createArticle, updateArticle };
}

export { useBlog };
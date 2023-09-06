import { useReducer } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

// initial article state
const initialArticleState = {
  title: '',
  author: '',
  todaysDate: new Date().toISOString().split('T')[0],
  publishDate: new Date().toISOString().split('T')[0],
  preview: '',
  content: '',
  tags: '',
}

// reducer function
const articleReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ARTICLE':
      return {
        ...state,
        article: action.payload
      }
    case 'UPDATE_TITLE':
      return {
        ...state,
        title: action.payload
      }
    case 'UPDATE_AUTHOR':
      return {
        ...state,
        author: action.payload
      }
    case 'UPDATE_PUBLISH_DATE':
      return {
        ...state,
        publishDate: action.payload
      }
    case 'UPDATE_PREVIEW':
      return {
        ...state,
        preview: action.payload
      }
    case 'UPDATE_CONTENT':
      return {
        ...state,
        content: action.payload
      }
    case 'UPDATE_TAGS':
      return {
        ...state,
        tags: action.payload
      }
    default:
      throw new Error('Invalid action type')
  }
}

// custom action creators
const useArticleReducer = () => {
  const [articleState, dispatch] = useReducer(articleReducer, initialArticleState)
  const blogState = useSelector(state => state.blog);
  const article = blogState.targettedArticle?.payload

  const updateTitle = (title) => {
    dispatch({ type: 'UPDATE_TITLE', payload: title })
  }

  const updateAuthor = (author) => {
    dispatch({ type: 'UPDATE_AUTHOR', payload: author })
  }

  const updatePublishDate = (publishDate) => {
    dispatch({ type: 'UPDATE_PUBLISH_DATE', payload: publishDate })
  }

  const updatePreview = (preview) => {
    dispatch({ type: 'UPDATE_PREVIEW', payload: preview })
  }

  const updateContent = (content) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: content })
  }

  const updateTags = (tags) => {
    dispatch({ type: 'UPDATE_TAGS', payload: tags })
  }

  const initiateForm = () => {
    if (article && blogState.articleEditMode) {
      updateTitle(article.title)
      updateAuthor(article.author)
      updatePublishDate(new Date(article.publishDate).toISOString().split('T')[0])
      updatePreview(article.preview)
      updateContent(article.content)
      updateTags(article.tags.join(', ').replaceAll(',', ', '))
    } else if (blogState.articleCreateMode) {
      updateTitle('')
      updateAuthor('')
      updatePublishDate(articleState.todaysDate)
      updatePreview('')
      updateContent('')
      updateTags('')
    }
  }


  const formChanged = () => {
    if (article && blogState.articleEditMode) {
      const formData = {
        title: articleState.title,
        author: articleState.author,
        publishDate: articleState.publishDate,
        preview: articleState.preview,
        content: articleState.content,
        tags: articleState.tags
      }

      const articleData = {
        title: article.title,
        author: article.content,
        publishDate: new Date(article.publishDate).toISOString().split('T')[0],
        preview: article.preview,
        content: article.content,
        tags: article.tags.join(', ').replaceAll(',', ', ')
      }
      return !_.isEqual(formData, articleData)
    } else if (blogState.articleCreateMode){
      return !_.isEqual(articleState, initialArticleState)
    }
  }

  return { articleState, updateTitle, updateAuthor, updatePublishDate, updatePreview, updateContent, updateTags, initiateForm, formChanged }
}

export { useArticleReducer }
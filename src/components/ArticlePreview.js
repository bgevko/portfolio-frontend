import React, { useState, useEffect, useContext, useRef }from 'react';
import { NavLink } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import ReactMarkdown from 'react-markdown'
import IconBtn from './IconBtn'
import ScrimOverlay from './ScrimOverlay'
import Dialog from './Dialog'
import BlogForm from '../components/BlogForm'
import { CSSTransition } from 'react-transition-group';
import { ErrorToast } from './Toasts';


function ArticlePreview({ include_fancy_link = false, article, edit_enabled=true}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogResponse, setDialogResponse] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [inAnimation, setinAnimation] = useState(true);

  const articleRef = useRef(null);
  const animationTime = 500; // change this to match CSS transition time

  const { updateBlog, setErrorActive, setErrorMessage, setConfirmActive, setConfirmMessage, baseUrl} = useContext(GlobalContext);

  const handleEdit = () => {
    setFormOpen(true);
  }

  const handleDelete = () => {
    setDialogOpen(true);
  }

  const handleDeleteArticle = async () => {
    const response = await fetch(`${baseUrl}/blog/${article?._id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setConfirmMessage('Article deleted.');
      setConfirmActive(true);
      setTimeout(() => { setConfirmActive(false) }, 3000);

      // Give the component time to animate out
      setTimeout(() => {
        updateBlog(prevState => prevState.filter(item => item._id !== article._id));
      }, animationTime);
    } else {
      // get error message from response body or default to response status
      const data = await response.json()
      setErrorMessage(`${response.status} error: ${data.error}`);
      setErrorActive(true);
      setTimeout(() => { setErrorActive(false); }, 4000);
    }
  }

  useEffect(() => {
    if (dialogResponse === true) {
      setinAnimation(false);
      handleDeleteArticle();
      setDialogOpen(false);
      setDialogResponse(null);
    } else if (dialogResponse === false) {
      setDialogOpen(false);
      setDialogResponse(null);
    }
  }, [dialogResponse])

  let date;
  if (article?.publishDate) {
    date = new Date(article.publishDate);
    date = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } else {
    date = '';  // Default value if publishDate is undefined
  }

  return (
    <>
      <CSSTransition
        in={inAnimation}
        nodeRef={articleRef}
        timeout={animationTime}
        classNames="grow"
        unmountOnExit
        appear
      >
        <article id={article?._id} ref={articleRef}>
          <h2>{article?.title}</h2>
          <span className="date-time">
            <p className="publish-date">{date}</p>
            <p>{`${article?.readTime} min read`}</p>
          </span>
          <span className="article-tags">
            {
              article?.tags?.map((tag, index) => {
                const formattedTag = tag.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                return <p key={`tag-${index}`}>{`#${formattedTag}`}</p>
              })
            }
          </span>
          {
          edit_enabled &&
          <span className="article-edit-btns">
            <IconBtn type="edit" action={handleEdit}/>
            <IconBtn type="delete" action={handleDelete}/>
          </span>
          }
            <ReactMarkdown className="markdown-content">{article?.preview}</ReactMarkdown>
            <NavLink to={`/blog/${(article.title).replace(/\s+/g, '-').toLowerCase()}`}>View article</NavLink>
            {include_fancy_link === true && <NavLink to="/blog" className="fancy-link">See all articles</NavLink>}
        </article>
      </CSSTransition>
      <ScrimOverlay open={formOpen} />
      <BlogForm formOpen={formOpen} setFormOpen={setFormOpen} article={article}/>
      <ScrimOverlay open={dialogOpen} />
      <Dialog 
          title='Delete Article?'
          message='This action cannot be undone.'
          active={dialogOpen}
          setResponse={setDialogResponse}
      />
    </>
  );
}

export default ArticlePreview;
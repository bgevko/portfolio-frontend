import React, { useRef, useState }from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { format } from 'date-fns';

//components
import EditPanel from './EditPanel';
import ReactMarkdown from 'react-markdown'

function ArticlePreview({ link_to_blog = false, article, edit_enabled=true}) {
  const articleRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  
  let date
  if (article) {
    date = format(new Date(article.publishDate), 'MMMM dd, yyyy')
  }

  return (
    <>
      <CSSTransition
        in={isVisible}
        nodeRef={articleRef}
        timeout={500}
        classNames="grow"
        unmountOnExit
        appear
      >
        <article ref={articleRef}>
          <h2>{article?.title}</h2>
          <span className="date-time">
            <p className="publish-date">
              {date}
              </p>
            <p>{`${article?.readTime} min read`}</p>
          </span>
          <span className="article-tags">
            {
              article?.tags?.map((tag, index) => {
                return <p key={`tag-${index}`}>{`#${tag}`}</p>
              })
            }
          </span>
          <EditPanel article={article} setIsVisible={setIsVisible}/>
            <ReactMarkdown className="markdown-content">{article?.preview}</ReactMarkdown>
            <NavLink to={`/blog/${article?.relativePath}`}>View article</NavLink>
            {link_to_blog === true && <NavLink to="/blog" className="fancy-link">See all articles</NavLink>}
        </article>
      </CSSTransition>
    </>
  );
}

export default ArticlePreview;
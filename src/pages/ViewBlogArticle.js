import React, { useContext, useEffect, useState, Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { GlobalContext } from '../GlobalContext';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

// component imports
import MoreContent from '../components/MoreContent';
import ArticlePreview from '../components/ArticlePreview';
import IconBtn from '../components/IconBtn';
import ScrimOverlay from '../components/ScrimOverlay';
import Dialog from '../components/Dialog';
import BlogForm from '../components/BlogForm';

// share button imports
import fb_icon from '../icons/fb-icon.svg'
import twitter_icon from '../icons/x-icon.svg'
import linkedin_icon from '../icons/linkedin-icon2.svg'
import threads_icon from '../icons/threads-icon.svg'
import reddit_icon from '../icons/reddit-icon.svg'
import email_icon from '../icons/email-icon2.svg'
import whatsapp_icon from '../icons/whatsapp-icon.svg'
import url_copy_icon from '../icons/copy-url-icon.svg'

function ViewBlogArticle( { article } ) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogResponse, setDialogResponse] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const { blog, updateBlog, setErrorActive, setErrorMessage, setConfirmActive, setConfirmMessage } = useContext(GlobalContext);
  const redirect = useNavigate();
  
  const handleEdit = () => {
    setFormOpen(true);
  }

  const handleDelete = () => {
    setDialogOpen(true);
  }

  useEffect(() => {
    if (dialogResponse === true) {
      handleDeleteArticle();
      setDialogOpen(false);
      setDialogResponse(null);
    } else if (dialogResponse === false) {
      setDialogOpen(false);
      setDialogResponse(null);
    }
  }, [dialogResponse])


  const handleDeleteArticle = async () => {
    const response = await fetch(`/blog/${article?.title}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      updateBlog(prevState => prevState.filter(item => item._id !== article._id));
      redirect('/blog');
      setConfirmMessage('Article deleted.');
      setConfirmActive(true);
      setTimeout(() => { setConfirmActive(false) }, 3000);

    } else {
      const data = await response.json()
      setErrorMessage(`${response.status} error: ${data.error}`);
      setErrorActive(true);
      setTimeout(() => { setErrorActive(false); }, 4000);
    }
  }

  // random article logic: get random article from blog array, repeat if blog article id is the same as the current article id
  let randomArticle;
  if (blog && blog?.length > 1) {
    do {
      randomArticle = blog[Math.floor(Math.random() * blog?.length)];
    } while (randomArticle._id === article._id);
  }

  // slug generate helper
  function generateSlug(text) {
    return text.toLowerCase().replace(/\W/g, '-')
  }

  // React-markdown renderer that generates an id heading elements
  function Heading({level, children}) {
    const text = children.reduce((text, child) => (typeof child === 'string' ? text + child : text), '');
    const slug = generateSlug(text);
    return React.createElement('h' + level, {id: slug}, children)
  }

  // React-markdown renderer for code blocks that uses Prism syntax highlighter
  function CodeBlock({language, value}) {
    return (
      <SyntaxHighlighter style={a11yDark} language={language} PreTag="div" children={value} />
    )
  }

  // Extract all markdown headings and generate slugs
  const tableOfContents = article?.content?.match(/#+\s.+/g)?.map(heading => {
    const headingText = heading.replace(/#+\s/, '');
    return [headingText, generateSlug(headingText)]
  })

  let date = new Date(article?.publishDate);
  // convert date to locale string formatted as "Month Day, Year"
  date = date?.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
  return (
    <>
      <section id="blog-section">
          <header>
            <div>
              <h2>{article?.title}</h2>
              <span className="date-time">
                <p className="publish-date">{date}</p>
                <p>{`${article?.readTime} min read`}</p>
              </span>
              <span className="article-tags">
                {
                  article?.tags?.map(tag => {
                    // format tag for display
                    const formattedTag = tag.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                    return <p key={tag}>{`#${formattedTag}`}</p>
                  })
                }
              </span>
              <span className="article-edit-btns">
                <IconBtn type="edit" action={handleEdit}/>
                <IconBtn type="delete" action={handleDelete}/>
              </span>
              <span className="share-buttons">
                <button className="share-icon" aria-label="Share on Facebook">
                  <img src={fb_icon} alt="Facebook icon" />
                </button>
                <button className="share-icon" aria-label="Share on X (Previously Twitter)">
                  <img src={twitter_icon} alt="Twitter icon" />
                </button>
                <button className="share-icon" aria-label="Share on LinkedIn">
                  <img src={linkedin_icon} alt="LinkedIn icon" />
                </button>
                <button className="share-icon" aria-label="Share on Threads">
                  <img src={threads_icon} alt="Threads icon" />
                </button>
                <button className="share-icon" aria-label="Share on Reddit">
                  <img src={reddit_icon} alt="Reddit icon" />
                </button>
                <button className="share-icon" aria-label="Share via email">
                  <img src={email_icon} alt="Email icon" />
                </button>
                <button className="share-icon" aria-label="Share on WhatsApp">
                  <img src={whatsapp_icon} alt="WhatsApp icon" />
                </button>
                <button className="share-icon" aria-label="Copy URL">
                  <img src={url_copy_icon} alt="Copy URL icon" />
                </button>
              </span>
              <nav>
                <span><NavLink to="/blog">Blog</NavLink></span>
                <p>{article?.title}</p>
              </nav>
            </div>
          </header>
          <article>
            {tableOfContents && <h3>CONTENTS</h3>}
            <nav>
              {
                tableOfContents?.map(headingContent => {
                  const [navText, navId] = headingContent;
                  return (
                    <a href={`#${navId}`} key={navId}>{navText}</a>
                  )
                })
              }
            </nav>
            <ReactMarkdown
              className="markdown-content"
              children={article?.content}
              components={{
                h1: Heading,
                h2: Heading,
                h3: Heading,
                h4: Heading,
                h5: Heading,
                h6: Heading,
                code: ({node, inline, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} {...props} />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
              />
  
          </article>
        </section>
        {
          randomArticle && 
          <MoreContent section_title="YOU MAY ALSO LIKE">
          <ArticlePreview article={randomArticle} include_fancy_link={true}/>
        </MoreContent>
        }

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

export default ViewBlogArticle;
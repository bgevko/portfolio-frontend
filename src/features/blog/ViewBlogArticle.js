import React, { useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'date-fns';

import { useGetArticleByPathQuery, useGetRandomArticleQuery } from '../../slices/blogApiSlice';

// component imports
import MoreContent from '../../components/MoreContent';
import ArticlePreview from './ArticlePreview';
import Loading from '../../components/Loading';

// share button imports
import fb_icon from '../../icons/fb-icon.svg'
import twitter_icon from '../../icons/x-icon.svg'
import linkedin_icon from '../../icons/linkedin-icon2.svg'
import threads_icon from '../../icons/threads-icon.svg'
import reddit_icon from '../../icons/reddit-icon.svg'
import email_icon from '../../icons/email-icon2.svg'
import whatsapp_icon from '../../icons/whatsapp-icon.svg'
import url_copy_icon from '../../icons/copy-url-icon.svg'

function ViewBlogArticle() {
  const { article_title } = useParams();
  const [isVisible, setIsVisible] = useState(true);

  const {
    data: articleData,
    isLoading: articleIsLoading,
    isSuccess: articleIsSuccess } = useGetArticleByPathQuery(article_title)

  const {
    data: nextArticleData,
    isLoading: nextArticleIsLoading,
    isSuccess: nextArticleIsSuccess } = useGetRandomArticleQuery({ exclude: articleData?.ids[0] })

  const article = articleData?.entities[articleData?.ids[0]]
  const nextArticle = nextArticleData?.entities[nextArticleData?.ids[0]]

  const tableOfContents = useMemo(() => {
    return article?.content?.match(/#+\s.+/g)?.map(heading => {
      const headingText = heading.replace(/#+\s/, '');
      return [headingText, headingText.toLowerCase().replace(/\W/g, '-')]
    })
  }, [article])

  const createSlug = useMemo(() => {
    return (text) => {
      return text.toLowerCase().replace(/\W/g, '-')
    }
  }, [])

  const Heading = useMemo(() => {
    return ({ level, children }) => {
      const text = children.reduce((text, child) => (typeof child === 'string' ? text + child : text), '');
      const slug = createSlug(text);
      return React.createElement('h' + level, { id: slug }, children)
    }
  }, [createSlug])

  const CodeBlock = useMemo(() => {
    return ({ language, value }) => {
      return (
        <SyntaxHighlighter style={a11yDark} language={language} PreTag="div" children={value} />
      )
    }
  }, [])

  const handleEdit = () => {
    //TODO
  }

  const handleDelete = () => {
    //TODO
  }

  let date
  if (article) {
    date = format(new Date(article?.publishDate), 'MMMM dd, yyyy')
  }

  return (
    <>
      {articleIsLoading && <Loading />}
      {articleIsSuccess &&
        <section id="blog-section">
          <header>
            <div className='alignment-container'>
              <h2>{article?.title}</h2>
              <span className="date-time">
                <p className="publish-date">{date}</p>
                <p>{`${article?.readTime} min read`}</p>
              </span>
              <span className="article-tags">
                {
                  article?.tags?.map(tag => {
                    return <p key={tag}>{`#${tag}`}</p>
                  })
                }
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
                code: ({ node, inline, className, children, ...props }) => {
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
      }
      {nextArticleIsLoading && <Loading />}
      {nextArticleIsSuccess &&
        <MoreContent section_title="YOU MAY ALSO LIKE">
          <ArticlePreview article={nextArticle} include_fancy_link={true} />
        </MoreContent>
      }
    </>
  );
}

export default ViewBlogArticle;

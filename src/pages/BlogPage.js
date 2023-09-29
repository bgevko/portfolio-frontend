import { React, useState, useMemo, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';

// Redux
import { useGetArticlesQuery, selectUniqueTags, makeSelectFilteredArticles } from '../slices/blogApiSlice';

// Components
import ArticlePreview from '../features/blog/ArticlePreview';
import Section from '../components/Section';
import Loading from '../components/Loading';

// Analytics
import ReactGA from 'react-ga4';

function BlogPage() {
  ReactGA.send({ hitType: 'pageview', page: '/blog' });

  const { data: articles, isLoading, isSuccess, isError, error } = useGetArticlesQuery()
  const [searchFilter, setSearchFilter] = useState('');
  const [tagFilter, setTagFilter] = useState([]);
  const [filterOn, setFilterOn] = useState(false);
  const uniqueTags = useSelector(state => selectUniqueTags(state))

  const handleTagSelect = (tag) => {
    if (tagFilter.includes(tag)) {
      setTagFilter(tagFilter.filter(t => t !== tag))
    } else {
      setTagFilter([...tagFilter, tag])
    }
  }

  const handleSearchInput = (e) => {
    debounce(() => setSearchFilter(e.target.value), 500);
  }

  const debounce = useMemo(() => {
    let timer;
    return (func, delay) => {
      clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  }, []);

  const selectFilteredArticles = makeSelectFilteredArticles();
  const filteredArticles = useSelector(state => selectFilteredArticles(state, tagFilter, searchFilter));

  useEffect(() => {
    if (tagFilter.length > 0 || searchFilter.length > 0) {
      setFilterOn(true)
    } else {
      setFilterOn(false)
    }
  }, [tagFilter, searchFilter])

  return (
    <>
      <Section id="blog-section">
        <header>
          <div className='alignment-container'>
            <h2>Blog Posts</h2>
            <label htmlFor="search" id="search-label">Search:</label>
            <input type="search" id="search" name="search" placeholder="Search by title" aria-label="search blog posts" onChange={e => handleSearchInput(e)} />
            <span className="search-tags">
              {
                uniqueTags.map((tag, index) => {
                  return (
                    <Fragment key={index}>
                      <input type="checkbox" id={tag} name="tag" value={tag} onChange={() => handleTagSelect(tag)} />
                      <label htmlFor={tag}>{`#${tag}`}</label>
                    </Fragment>
                  )
                })
              }
            </span>
          </div>
        </header>
        <div className='alignment-container'>
          {isLoading && <Loading />}
          {isSuccess &&
            filterOn ?
            filteredArticles?.map(article => <ArticlePreview key={article._id} article={article} />)
            :
            articles?.ids?.map(id => <ArticlePreview key={id} article={articles.entities[id]} />)
          }
        </div>
      </Section>
    </>
  );
}

export default BlogPage;

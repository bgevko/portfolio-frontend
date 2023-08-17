import { React, useState, useContext, Fragment } from 'react';
import { GlobalContext } from '../GlobalContext';
import ArticlePreview from '../components/ArticlePreview';
import AddPostBtn from '../components/AddPostBtn';
import BlogForm from '../components/BlogForm'
import Section from '../components/Section';

function BlogPage( {blog} ) {
    const [filterTags, setFilterTags] = useState([]);
    const [search, setSearch] = useState('');
    const [formOpen, setFormOpen] = useState(false);

    const { searchTags } = useContext(GlobalContext);
    
    /* handle search tag checkbox click */
    const handleTagClick = (e) => {
        const tagValue = e.target.value;
        const checked = e.target.checked;
        if (checked && !filterTags.includes(tagValue)) {
            setFilterTags([...filterTags, tagValue]);
        } else if (!checked && filterTags.includes(tagValue)) {
            setFilterTags(filterTags.filter(tag => tag !== tagValue));
        }
    }

    /* handle search input change */
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }
    
    return (
        <>
        <Section id="blog-section">
            <header>
                <div>
                    <h2>Blog Posts</h2>
                    <label htmlFor="search" id="search-label">Search:</label>
                    <input type="search" id="search" name="search" aria-label="search blog posts" onChange={handleSearchChange}/>
                    <span className="search-tags">
                        {
                            searchTags?.map(tag => {
                                /* format for id and value attributes */
                                const modifiedTag = tag.replace(' ', '-').toLowerCase();

                                /* format for display */
                                const formattedTag = tag.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                                
                                return (
                                <Fragment key={modifiedTag}>
                                    <input type="checkbox" id={modifiedTag} name="tag" value={tag} onChange={handleTagClick}/>
                                    <label htmlFor={modifiedTag}>{`#${formattedTag}`}</label>
                                </Fragment>
                                );
                            })
                        }
                    </span>
                </div>
            </header>
            <div>
                <AddPostBtn setFormOpen={setFormOpen}/>
            </div>

            {/* Very basic tag filtering and search functionality. Tag filtering filters
                articles if they have the same tag and the searchbar filters articles if they match the article title. 
                Tried to do it just for fun, it's a good starting point and I can build on it later
            */}
            {
                // no search or filter tags
                (!search && filterTags.length === 0) &&
                blog?.map(article => {
                    return <ArticlePreview key={article._id} article={article} />
                }
                )
            }
            {
                // filter tags but no search
                (!search && filterTags.length > 0) &&
                blog?.filter(article => {
                    return article.tags.some(tag => filterTags.includes(tag));
                }
                ).map(article => {
                    return <ArticlePreview key={article._id} article={article} />
                }
                )
            }
            {
                // search but no filter tags (return not found message if no articles found)
                (search && filterTags.length === 0) && (() => {
                const filteredArticles = blog?.filter(article => {
                    return article.title.toLowerCase().includes(search.toLowerCase());
                });

                if (filteredArticles.length === 0) {
                    return <p>No articles found</p>;
                } else {
                    return filteredArticles.map(article => {
                        return <ArticlePreview key={article._id} article={article} />
                    });
                }
                })()
            }
            {
                // search and filter tags (return not found message if no articles found)
                (search && filterTags.length > 0) && (() => {
                    const filteredArticles = blog?.filter(article => {
                        return article.title.toLowerCase().includes(search.toLowerCase());
                    });
    
                    if (filteredArticles.length === 0) {
                        return <p>No articles found</p>;
                    } else {
                        return filteredArticles.map(article => {
                            return <ArticlePreview key={article._id} article={article} />
                        });
                    }
                    })()
            }
        </Section>
        {<BlogForm formOpen={formOpen} setFormOpen={setFormOpen} />}
        </>
    );
}

export default BlogPage;
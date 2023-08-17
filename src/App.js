// Import dependencies
import React, { useState, useEffect, useRef } from 'react';
import { GlobalContext } from './GlobalContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Components, styles, media
import './App.css';
import MainNav from './components/MainNav';
import MobileNav from './components/MobileNav';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { ErrorToast, ConfirmationToast } from './components/Toasts';


// Import Pages
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import ViewBlogArticle from './pages/ViewBlogArticle';
import ContactPage from './pages/ContactPage';
import OrderPage from './pages/OrderPage';
import GalleryPage from './pages/GalleryPage';

// Define the function that renders the content in Routes, using State.
function App() {
  const [blog, updateBlog] = useState([])
  const [searchTags, updateSearchTags] = useState([])
  const [errorActive, setErrorActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmActive, setConfirmActive] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')

  const mainRef = useRef(null)
  const scrollToTop = () => {
    mainRef.current.scrollTo(0, 0)
  }
  
  // send a GET request to the server to acquire all blogs
  const getBlog = async () => {
    const response = await fetch('/blog')
    const data = await response.json()
    updateBlog(data)
  }

  // Get blogs from server
  useEffect(() => {
    getBlog()
  }, [])

  useEffect(() => {
    const search_tags = blog.reduce((acc, cur) => {
      cur.tags.forEach(tag => {
          if (!acc.includes(tag)) {
              acc.push(tag);
          }
      });
      return acc;
    }, []);
    updateSearchTags(search_tags.sort());
  }, [blog])

  // handle a strange case in which both error and confirmation toasts are active. I'll make the confirmation toast appear after the error toast has disappeared.
  useEffect(() => {
    if (errorActive && confirmActive) {
      setConfirmActive(false)
      setTimeout(() => { 
        if (errorActive) setErrorActive(false)
        setConfirmActive(true)
        setTimeout(() => { setConfirmActive(false) }, 3000)
      }, 4000)
    }
  }, [errorActive, confirmActive])

  return (
    <>
      <BrowserRouter>
          <SiteHeader>
            <MainNav />
          </SiteHeader>
          <main ref={mainRef}>
            <GlobalContext.Provider value={{ 
              blog, 
              updateBlog,
              searchTags, 
              setErrorActive,
              setErrorMessage,
              setConfirmActive,
              setConfirmMessage,
              scrollToTop
            }}>
              <Routes> 
                <Route 
                  path="/" element={<HomePage article={blog[0]}/>} />
                <Route path="/blog" element={<BlogPage blog={blog} />} />

                  {blog.map((article) => (
                    <Route 
                      key={article._id} 
                      path={`/blog/${(article.title).replace(/\s+/g, '-').toLowerCase()}`} 
                      element={<ViewBlogArticle article={article} />} />
                  ))}

                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/order" element={<OrderPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />

              </Routes>
            </GlobalContext.Provider>
            <ErrorToast active={errorActive} message={errorMessage} />
            <ConfirmationToast active={confirmActive} message={confirmMessage} />
          </main>
          
          <SiteFooter>
            <MobileNav></MobileNav>
          </SiteFooter>
      </BrowserRouter>
    </>
  );
}

export default App;
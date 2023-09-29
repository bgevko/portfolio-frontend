
// Components
import MainNav from './components/MainNav';
import MobileNav from './components/MobileNav';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Modals from './components/Modals';

// Pages
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import ViewBlogArticle from './features/blog/ViewBlogArticle';
import ContactPage from './pages/ContactPage';
import ProjectsPage from './pages/ProjectsPage';

// Routes
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Google Analytics
import ReactGA from 'react-ga';
ReactGA.initialize('G-B5FMH64F73');
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
  return (
    <>
      <BrowserRouter>
      <Modals />
        <SiteHeader>
          <MainNav />
        </SiteHeader>
          <main>
          <Routes> 
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:article_title" element={<ViewBlogArticle />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <SiteFooter>
          <MobileNav></MobileNav>
        </SiteFooter>
      </BrowserRouter>
    </>
  );
}

export default App;

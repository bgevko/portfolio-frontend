import { React, useRef, useEffect} from 'react';
import selfie from '../images/selfie.webp'
import MoreContent from '../components/MoreContent';
import ArticlePreview from '../features/blog/ArticlePreview';
import Section from '../components/Section';
import Loading from '../components/Loading';
import { CSSTransition } from 'react-transition-group';
import { useGetLatestArticleQuery } from '../slices/blogApiSlice';


function HomePage() {
    const heroRef = useRef(null);
    const headlineRef = useRef(null);

    const { data, isLoading, isSuccess, isError, error } = useGetLatestArticleQuery()

    let article = null
    if (isSuccess) article = data.entities[data.ids[0]]
    
    return (
        <>
            <Section id="intro-section">
                <header>
                    <div className='alignment-container'>
                        <CSSTransition
                            in={true}
                            nodeRef={heroRef}
                            timeout={200}
                            classNames="fade"
                            unmountOnExit
                            appear
                        >
                            <img src={selfie} alt="Bogdan with thumbs up." id="hero-image" ref={heroRef}/>
                        </CSSTransition>

                        <CSSTransition
                            in={true}
                            nodeRef={headlineRef}
                            timeout={200}
                            classNames="fade"
                            unmountOnExit
                            appear
                        >
                            <div id="hero-text" ref={headlineRef}>
                                <h1 id="intro-greeting-text">HI THERE!</h1>
                                <h1 id="intro-name-text">I'M <span>BOGDAN</span></h1>
                            </div>
                        </CSSTransition>
                    </div>
                </header>
                <article id="intro-article">
                    <h3>WELCOME TO MY HOME PAGE</h3>
                    <p>After dedicating years to the Marine Corps, I pivoted my career towards an enduring passion—technology. Now, at the age of 31, I'm immersed in Computer Science studies at Oregon State University, aiming to fulfill my aspiration of becoming a software developer. This website is my digital workshop, where I fine-tune my web development skills and catalog my broader technical pursuits. </p>
                    
                    <p>I designed every element myself in Figma, eventually transitioning from concept to fully interactive React components. The Blog section offers articles, technical notes, and snippets — readily filtered by tag or keyword. The Projects section provides a curated selection of my technical endeavors, categorized by the technologies I employed. </p>

                    <p>If you'd like to connect, you can reach me through the Contact section. Thank you for stopping by. </p>
                        
                </article>
            </Section>
            {isLoading && <Loading/>}
            {isSuccess && <MoreContent section_title="LATEST BLOG POST">
                <ArticlePreview article={article} link_to_blog={true} edit_enabled={true}/>
            </MoreContent>}
        </>
    );
}

export default HomePage;

import { React, useRef, useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../GlobalContext';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import selfie from '../images/selfie.webp'
import MoreContent from '../components/MoreContent';
import ArticlePreview from '../components/ArticlePreview';
import Section from '../components/Section';
import { CSSTransition } from 'react-transition-group';


function HomePage( { article } ) {
    const heroRef = useRef(null);
    const headlineRef = useRef(null);

    return (
        <>
            <Section id="intro-section">
                <header>
                    <div>
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
                    <p>I’m a Computer Science student at Oregon State University. I love technology, and my primary interests are web development, mobile development, UI/UX design, graphics programming, digital signal processing, machine learning, and game development. </p>
                    
                    <p>I designed this site in Figma and brought it to life using React, Node, Express, and MongoDB. My goal was to have a visually appealing and functional website accessible and responsive on all devices. I implemented a basic markdown content management system that allows me to add, edit, and remove blog posts directly with my custom UI, which I built from scratch.</p>

                    <p>My primary career goal is to graduate and then find work in one of the fields that I listed above. I think having diverse exposure to different aspects of technology is a crucial part of any Computer Science curriculum. I love learning, and I hope that my curiosity will guide me to a fruitful software developer career. </p>
                        
                    <p>Thanks for visiting my website!</p>
                </article>
            </Section>
            { article &&
            <MoreContent section_title="LATEST BLOG POST">
                <ArticlePreview article={article} include_fancy_link={true} edit_enabled={false}/>
            </MoreContent>
            }
        </>
    );
}

export default HomePage;
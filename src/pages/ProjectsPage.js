import { React, useState} from 'react';
import Section from '../components/Section';
import Card from '../components/Card';
import { GlobalContext } from '../GlobalContext';

// Photos
import bioSite from '../images/bio-site.png';
import webTool from '../images/data-generator-desktop-ui.png'
import cmdTool from '../images/cmdline.webp'

const projectItems = [
    {
        photo: cmdTool,
        title: "Blog CMS",
        subtitle: "Python, Git, Markdown",
        content: "I created a command line tool that automatically pushes my Obsidian notes to the blog on this website. I can edit my notes in Obsidian and push all the changes to the blog with a single command.",
        actionLabel: "View Project",
        actionUrl: 'https://github.com/bgevko/blog-cms'
    },
    {   
        photo: bioSite,
        title: "Biology Website",
        subtitle: "Jekyll and GitHub Pages",
        content: "I created this static website to host an assignment for a biology class. I used Figma to make the initial design and implemented it using the Jekyll framework. I deployed it using GitHub pages.",
        actionLabel: "View Project",
        actionUrl: 'https://bgevko.github.io/bi101-portfolio/index.html'
    },
    {
        photo: webTool,
        title: "Random Data Generator",
        subtitle: "React",
        content: "I designed an open-source random data generator web tool (www.randomdatagen.com) using React. The interface updates dynamically in real-time, and the tool is blazing fast because it doesn't need to make any external requests; all data logic is handled by frontend JavaScript.",
        actionLabel: "View Project",
        actionUrl: 'https://www.randomdatagen.com'
    },
]

function ProjectsPage() {
    const [openCard, setOpenCard] = useState(null);
    
    return (
        <>
        <Section id='order-section'>
            <header style={{height: 'fit-content', padding: 'var(--dynamic-padding) 0'}}>
                <div style={{alignItems: "center"}}>
                    <h2>Projects</h2>
                </div>
            </header>
            <article id="gallery">
                <GlobalContext.Provider value={{openCard, setOpenCard}}>
                    {projectItems.map((item, index) => (
                        <Card
                            key={index}
                            index={index}
                            photo={item.photo}
                            title={item.title}
                            subtitle={item.subtitle}
                            content={item.content}
                            actionLabel={item.actionLabel}
                            actionUrl={item.actionUrl}
                        />
                    ))}
                </GlobalContext.Provider>
            </article>
        </Section>
        </>
    )
}

export default ProjectsPage;

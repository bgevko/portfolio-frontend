import { React, useState} from 'react';
import Section from '../components/Section';
import Card from '../components/Card';
import { GlobalContext } from '../GlobalContext';

// Photos
import bioSite from '../images/bio-site.png';
import webTool from '../images/data-generator-desktop-ui.png'
import qrTracker from '../images/qr-tracker.png'
import webDesign from '../images/web-design.png'

const projectItems = [
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
    {
        photo: qrTracker,
        title: "QR Tracker",
        subtitle: "Flask and Heroku",
        content: "I created a minimal QR code tracker for a group project using Flask and deployed it to Heroku. The tracker would update when the group's QR codes were scanned, providing real-world data we presented in our final presentation."
    },
    {
        photo: webDesign,
        title: "Author Website",
        subtitle: "In Progress",
        content: "I'm currently building a website for a small author using SvelteKit. I'm using Tailwind CSS for styling and SvelteKit for routing and page generation. I'm also using SvelteKit's adapter to deploy the website to Netlify."
    }
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
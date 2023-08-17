import { React, useState} from 'react';
import Section from '../components/Section';
import Card from '../components/Card';
import { GlobalContext } from '../GlobalContext';

// Photos
import bioSite from '../images/bio-site.png';
import bioSiteMobile from '../images/bio-site-mobile-ui.png';
import theme from '../images/theme.png';
import classDiagram from '../images/class-diagram.png';
import webTool from '../images/data-generator-desktop-ui.png'
import webToolMobile from '../images/data-generator-mobile-ui.png'
import qrTracker from '../images/qr-tracker.png'
import renoiseTool from '../images/renoise-screenshot.png'
import webDesign from '../images/web-design.png'
import metronomeUi from '../images/metronome-app-ui.png'

const galleryItems = [
    {   
        photo: bioSite,
        title: "Biology Website",
        subtitle: "Desktop Layout",
        content: "I created this static website to host an assignment for a biology class. I used Figma to make the initial design and implemented it using the Jekyll framework. I deployed it using GitHub pages.",
        actionLabel: "View Project",
        actionUrl: 'https://bgevko.github.io/bi101-portfolio/index.html'
    },
    {
        photo: bioSiteMobile,
        title: "Biology Website",
        subtitle: "Mobile Layout",
        content: "I ensured the website worked on mobile using reactive design."
    },
    {
        photo: theme,
        title: "Theme Design",
        subtitle: "Figma Skills",
        content: "I designed a cohesive interface for my Anatomy notes in Figma to create a seamless scrolling experience. The image on the left are all the pages I created and the subsequent images are random samples to showcase the design."
    },
    {
        photo: metronomeUi,
        title: "Metronome App",
        subtitle: "UI Design",
        content: "I designed a user interface for an iOS metronome app in Figma"
    },
    {
        photo: webTool,
        title: "Web Tool",
        subtitle: "Desktop Layout",
        content: "I designed an open-source random data generator web tool (www.randomdatagen.com) using React. The interface updates dynamically in real-time, and the tool is blazing fast because it doesn't need to make any external requests; all data logic is handled by frontend JavaScript.",
        actionLabel: "View Project",
        actionUrl: 'https://www.randomdatagen.com'
    },
    {   
        photo: webToolMobile,
        title: "Web Tool",
        subtitle: "Mobile Layout",
        content: "I made the tool responsive for mobile devices and also added a dark mode."
    },
    {
        photo: classDiagram,
        title: "Web Tool",
        subtitle: "Data Logic",
        content: "I used a variation of an Object Oriented Programming (OOP) design pattern known as Factory when implementing the data logic. I documented the implementation for future reference.",
        actionLabel: "View Documentation"
    },
    {
        photo: qrTracker,
        title: "QR Tracker",
        subtitle: "Flask and Heroku",
        content: "I created a minimal QR code tracker for a group project using Flask and deployed it to Heroku. The tracker would update when the group's QR codes were scanned, providing real-world data we presented in our final presentation."
    },
    {
        photo: webDesign,
        title: "Website Design",
        subtitle: "Side Project",
        content: "I'm currently building a website for a small author using SvelteKit. I'm using Tailwind CSS for styling and SvelteKit for routing and page generation. I'm also using SvelteKit's adapter to deploy the website to Netlify."
    },
    {
        photo: renoiseTool,
        title: "Renoise Plugin",
        subtitle: "Lua Side Project",
        content: "I'm currently working on a plugin for the Renoise DAW using Lua. I'm using the Renoise API to create a plugin that will overhaul Renoise editing, deleting, and copying functionality, allowing users to create custom keybinds and macros to speed up their workflow."
    }
]

function GalleryPage() {
    const [openCard, setOpenCard] = useState(null);
    
    return (
        <>
        <Section id='order-section'>
            <header style={{height: 'fit-content', padding: 'var(--dynamic-padding) 0'}}>
                <div style={{alignItems: "center"}}>
                    <h2>Gallery</h2>
                </div>
            </header>
            <article id="gallery">
                <GlobalContext.Provider value={{openCard, setOpenCard}}>
                    {galleryItems.map((item, index) => (
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

export default GalleryPage;
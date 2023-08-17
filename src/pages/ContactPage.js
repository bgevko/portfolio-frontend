import React, {useState, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import Section from '../components/Section';

function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [contactMethod, setContactMethod] = useState('');
    const [contactTime, setContactTime] = useState([]);

    const { setErrorMessage, setErrorActive, setConfirmMessage, setConfirmActive, scrollToTop } = useContext(GlobalContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = {
            name: name,
            email: email,
            subject: subject,
            message: message,
            contactMethod: contactMethod,
            contactTime: contactTime
        };

        // send a POST request to /contact
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                navigate('/');
                // Scroll to top of page
                window.scrollTo(0,0)
                scrollToTop()
                setConfirmMessage('Message sent successfully!');
                setConfirmActive(true);
                // timer
                setTimeout(() => {setConfirmActive(false)}, 3000);

            } else {
                const data = await response.json();
                setErrorMessage(`${response.status} error: ${data.error}`);
                setErrorActive(true);
                setTimeout(() => {setErrorActive(false)}, 4000);
            }
        } catch (err) {
            setErrorMessage(err.message)
            setErrorActive(true);

            // timer
            setTimeout(() => {
                setErrorActive(false);
            }, 4000);
        }
    }

    return (
        <>
        <Section id="contact-section">
            <header>
                <div>
                    <h2>How Can I Help You?</h2>
                    <p>Share your thoughts below.</p>
                </div>
            </header>
            <article>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Personal Information</legend>
                        <label htmlFor="full-name" className="required">Full name</label>
                        <input
                            type="text"
                            autoFocus
                            placeholder="First Last"
                            size="30"
                            maxLength="100"
                            id="full-name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label htmlFor="email" className="required">Email</label>
                        <input
                            type="email"
                            placeholder="email@domain.com"
                            size="30"
                            maxLength="100"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </fieldset>
                    <fieldset>
                        <legend>Reason For Contact</legend>
                        <label htmlFor="subject" className="required">Subject</label>
                        <select name="subject" id="subject" onChange={(e) => setSubject(e.target.value)}>
                            <option value="question">Question</option>
                            <option value="feedback">Feedback</option>
                            <option value="other">Other</option>
                        </select>

                        <label htmlFor="message" className="required">Message</label>
                        <textarea
                            placeholder="Your message here..."
                            maxLength="500"
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </fieldset>
                    <fieldset>
                        <legend>How Can I Reach You?</legend>
                        <h5>Preferred Contact Method</h5>

                        <span>
                            <label htmlFor="email-radio">Email</label>
                            <input
                                type="radio"
                                id="email-radio"
                                name="contact-method"
                                value="email"
                                checked={contactMethod === 'email'}
                                onChange={(e) => setContactMethod(e.target.value)}
                            />
                        </span>
                        <span>
                            <label htmlFor="phone-radio">Phone</label>
                            <input
                                type="radio"
                                id="phone-radio"
                                name="contact-method"
                                value="phone"
                                checked={contactMethod === 'phone'}
                                onChange={(e) => setContactMethod(e.target.value)}
                            />
                        </span>

                        <h5>Preferred Contact Time</h5>
                        <span>
                            <label htmlFor="morning-checkbox">Morning</label>
                            <input
                                type="checkbox"
                                id="morning-checkbox"
                                name="contact-time"
                                value="morning"
                                checked={contactTime.includes('morning')}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setContactTime([...contactTime, e.target.value]);
                                    } else {
                                        setContactTime(contactTime.filter((time) => time !== e.target.value));
                                    }
                                }}
                            />
                        </span>
                        <span>
                            <label htmlFor="afternoon-checkbox">Afternoon</label>
                            <input
                                type="checkbox"
                                id="afternoon-checkbox"
                                name="contact-time"
                                value="afternoon"
                                checked={contactTime.includes('afternoon')}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setContactTime([...contactTime, e.target.value]);
                                    } else {
                                        setContactTime(contactTime.filter((time) => time !== e.target.value));
                                    }
                                }}
                            />
                        </span>
                        <span>
                            <label htmlFor="evening-checkbox">Evening</label>
                            <input
                                type="checkbox"
                                id="evening-checkbox"
                                name="contact-time"
                                value="evening"
                                checked={contactTime.includes('evening')}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setContactTime([...contactTime, e.target.value]);
                                    } else {
                                        setContactTime(contactTime.filter((time) => time !== e.target.value));
                                    }
                                }}
                            />
                        </span>
                    </fieldset>
                    <input type="submit" value="Submit" />
                </form>
            </article>
            </Section>
        </>
    )
}

export default ContactPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../components/Section';
import { useSendContactFormMutation } from '../features/api/apiSlice';
import { useNotification } from '../hooks/useNotification';

import Loading from '../components/Loading';

function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [sendContactForm, { isLoading }] = useSendContactFormMutation();
    const { confirm } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = {
            name: name,
            email: email,
            subject: subject,
            message: message,
        };

        try {
            await sendContactForm(formData).unwrap();
            navigate('/');
            confirm("Message sent.");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
        <Section id="contact-section">
            <header>
                <div className='alignment-container'>
                    <h2>Contact me</h2>
                    <p>Share your thoughts below.</p>
                </div>
            </header>
            <article>
                {isLoading && <Loading />}
                {!isLoading &&
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Your contact information</legend>
                        <label htmlFor="full-name">Name</label>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Name"
                            size="30"
                            maxLength="100"
                            id="full-name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                        <legend>How can I help you?</legend>
                        <label htmlFor="subject" className="required">Subject</label>
                        <input
                            type="text"
                            placeholder="Question, feedback, etc."
                            size="30"
                            maxLength="100"
                            id="subject"
                            name="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />

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
                    <input type="submit" value="Submit" />
                </form>
                }
            </article>
            </Section>
        </>
    )
}

export default ContactPage;

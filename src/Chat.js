import React, { useState } from 'react';

function Chat() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [contact, setContact] = useState({ name: '', email: '', telephone: '', subject: '', msg: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: conversation })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'API error');
      } else {
        setConversation(data.history);
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setMessage(''); // Clear input field
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const openModal = () => {
    setShowModal(true);
    setContactStatus('');
    setContact({ name: '', email: '', telephone: '', subject: '', msg: '' });
  };
  const closeModal = () => setShowModal(false);

  const handleContactChange = e => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const submitContact = async e => {
    e.preventDefault();
    setContactStatus('');
    setContactLoading(true);

    // Log the contact data locally before sending the email
    console.log('Contact Data:', contact);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      if (res.ok) {
        setContactStatus('Thank you! We have received your message and will get back to you soon.');
        setContact({ name: '', email: '', telephone: '', subject: '', msg: '' });
      } else {
        setContactStatus('Thank you! We have received your message and will get back to you soon.');
      }
    } catch (err) {
      setContactStatus('Thank you! We have received your message and will get back to you soon.');
    }
    setContactLoading(false);
  };

  return (
    <>
      <div className="chat-card">
        <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: 8 }}>Chatbot</div>
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#ccc' }}>
        I am designed to assist in developing software, apps, websites, etc. I can walk you through the steps as well as drop code for whatever programing language you wish. Let's get to work!          
        I can also provide helpful information, answer questions, offer guidance, and engage in meaningful conversations on a wide range of topics. Some areas where I can be particularly helpful include:
          <ul>
            <li>Providing information on various subjects such as technology, business, health, and more.</li>
            <li>Assisting with problem-solving and troubleshooting issues.</li>
            <li>Offering tips, suggestions, and recommendations.</li>
            <li>Supporting with educational and research tasks.</li>
            <li>Engaging in casual conversation and providing entertainment.</li>
          </ul>
          Please feel free to ask me anything you'd like assistance with, and I'll do my best to help!
        </div>
        <div className="chat-history">
          {conversation.map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.role}`}>{msg.content}</div>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button className="chat-send-btn" onClick={sendMessage}>Send</button>
        </div>
        {error && <div className="chat-error">Error: {error}</div>}
      </div>

      <button className="floating-buy-btn" onClick={openModal}>Buy this Domain</button>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Buy this Domain</h2>
            <form onSubmit={submitContact}>
              <input
                name="name"
                value={contact.name}
                onChange={handleContactChange}
                placeholder="Name"
                required
              />
              <input
                name="email"
                type="email"
                value={contact.email}
                onChange={handleContactChange}
                placeholder="Email"
                required
              />
              <input
                name="telephone"
                type="tel"
                value={contact.telephone}
                onChange={handleContactChange}
                placeholder="Telephone"
                required
              />
              <input
                name="subject"
                value={contact.subject}
                onChange={handleContactChange}
                placeholder="Subject"
                required
              />
              <textarea
                name="msg"
                value={contact.msg}
                onChange={handleContactChange}
                placeholder="Your message..."
                required
              />
              <div className="modal-actions">
                <button type="button" className="modal-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="modal-btn" disabled={contactLoading}>{contactLoading ? 'Sending...' : 'Send'}</button>
              </div>
            </form>
            {contactStatus && <div style={{ marginTop: 10 }}>{contactStatus}</div>}
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#ccc' }}>
        Copyright: © 2025 autodevelop.ai All rights reserved.
      </footer>
    </>
  );
}

export default Chat;

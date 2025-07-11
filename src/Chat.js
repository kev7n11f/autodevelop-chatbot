import React, { useState } from 'react';

function Chat() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [contact, setContact] = useState({ name: '', email: '', msg: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  const sendMessage = async () => {
    setError('');
    setReply('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        setError('Server error: ' + text);
        return;
      }
      if (!res.ok) {
        setError(data.error || 'API error');
      } else {
        setReply(data.reply);
      }
    } catch (err) {
      setError(err.message || 'Network error');
    }
  };

  const openModal = () => {
    setShowModal(true);
    setContactStatus('');
    setContact({ name: '', email: '', msg: '' });
  };
  const closeModal = () => setShowModal(false);

  const handleContactChange = e => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const submitContact = async e => {
    e.preventDefault();
    setContactStatus('');
    setContactLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      if (res.ok) {
        setContactStatus('Message sent! We will contact you soon.');
        setContact({ name: '', email: '', msg: '' });
      } else {
        setContactStatus('Failed to send. Please try again.');
      }
    } catch (err) {
      setContactStatus('Network error.');
    }
    setContactLoading(false);
  };

  return (
    <>
      <div className="chat-card">
        <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: 8 }}>Chatbot</div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button className="chat-send-btn" onClick={sendMessage}>Send</button>
        </div>
        <div className="chat-reply">{reply}</div>
        {error && <div className="chat-error">Error: {error}</div>}
      </div>

      <button className="floating-buy-btn" onClick={openModal}>Buy this Domain</button>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Buy this Domain</h2>
            <form onSubmit={submitContact}>
              <label>Name<br />
                <input name="name" value={contact.name} onChange={handleContactChange} required />
              </label>
              <label>Email<br />
                <input name="email" type="email" value={contact.email} onChange={handleContactChange} required />
              </label>
              <label>Message<br />
                <textarea name="msg" value={contact.msg} onChange={handleContactChange} required placeholder="Your message..." />
              </label>
              <div className="modal-actions">
                <button type="button" className="modal-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="modal-btn" disabled={contactLoading}>{contactLoading ? 'Sending...' : 'Send'}</button>
              </div>
            </form>
            {contactStatus && <div style={{ marginTop: 10 }}>{contactStatus}</div>}
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;

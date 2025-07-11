import React, { useState } from 'react';

function Chat() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

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

  return (
    <div>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <div>Reply: {reply}</div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
}

export default Chat;

import React, { useState, useEffect } from 'react';
import './App.css';
import Chat from './Chat';

function App() {
  const [theme, setTheme] = useState('dark');
  const [themeLoading, setThemeLoading] = useState(true);

  // Load theme on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch('/api/theme');
        if (response.ok) {
          const data = await response.json();
          setTheme(data.theme || 'dark');
        }
      } catch (err) {
        console.error('Failed to load theme:', err);
        // Fall back to localStorage
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
      }
      setThemeLoading(false);
    };

    loadTheme();
  }, []);

  // Apply theme to body and save to both API and localStorage
  useEffect(() => {
    if (!themeLoading) {
      document.body.className = `theme-${theme}`;
      localStorage.setItem('theme', theme);
      
      // Save to API (don't wait for response)
      fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme })
      }).catch(err => {
        console.error('Failed to save theme to server:', err);
      });
    }
  }, [theme, themeLoading]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  if (themeLoading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <h1>AutoDevelop Chatbot</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      <Chat />
    </div>
  );
}

export default App;

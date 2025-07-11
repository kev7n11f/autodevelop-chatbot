// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to log visitor details
app.use((req, res, next) => {
  const logFilePath = path.join(__dirname, 'logs/visitor_logs.json'); // Use persistent 'logs/' directory
  const logEntry = {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  };
  try {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true }); // Ensure the directory exists
    const existingLogs = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath, 'utf8')) : [];
    existingLogs.push(logEntry);
    fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2));
    console.log('Visitor log written to:', logFilePath);
  } catch (err) {
    console.error('Failed to log visitor data:', err);
  }
  next();
});

// Serve static files from the React build folder with aggressive caching for static assets
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      // No cache for index.html
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
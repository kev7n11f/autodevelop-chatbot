const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Get current theme
router.get('/', (req, res) => {
  try {
    const themePath = path.join(__dirname, '../logs/theme_settings.json');
    let themeData = { theme: 'dark' }; // Default theme
    
    if (fs.existsSync(themePath)) {
      themeData = JSON.parse(fs.readFileSync(themePath, 'utf8'));
    }
    
    res.json(themeData);
  } catch (err) {
    console.error('Theme get error:', err);
    res.json({ theme: 'dark' }); // Fallback to default
  }
});

// Set theme
router.post('/', (req, res) => {
  try {
    const { theme } = req.body;
    
    // Validate theme
    if (!theme || !['dark', 'light'].includes(theme)) {
      return res.status(400).json({ error: 'Valid theme required (dark or light)' });
    }
    
    const baseDir = path.resolve(__dirname, '../logs');
    const themePath = path.resolve(baseDir, 'theme_settings.json');
    if (!themePath.startsWith(baseDir)) {
      throw new Error('Invalid theme path');
    }
    const themeData = { theme, updatedAt: new Date().toISOString() };
    
    // Ensure directory exists
    fs.mkdirSync(path.dirname(themePath), { recursive: true });
    fs.writeFileSync(themePath, JSON.stringify(themeData, null, 2));
    
    res.json({ success: true, theme });
  } catch (err) {
    console.error('Theme set error:', err);
    res.status(500).json({ error: 'Failed to save theme preference' });
  }
});

module.exports = router;
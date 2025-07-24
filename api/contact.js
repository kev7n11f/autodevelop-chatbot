const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().substring(0, 500); // Limit length to prevent abuse
};

router.post('/', async (req, res) => {
  try {
    const { name, email, telephone, subject, msg } = req.body || {};
    
    // Validate required fields
    if (!name || !email || !telephone || !subject || !msg) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      telephone: sanitizeInput(telephone),
      subject: sanitizeInput(subject),
      msg: sanitizeInput(msg)
    };

    // Validate email format
    if (!isValidEmail(sanitizedData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate that sanitized fields are not empty
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.telephone || 
        !sanitizedData.subject || !sanitizedData.msg) {
      return res.status(400).json({ error: 'All fields must contain valid content' });
    }

    // Log contact data to a file
    const logFilePath = path.join(__dirname, '../logs/contact_logs.json');
    const logEntry = { ...sanitizedData, timestamp: new Date().toISOString() };
    
    try {
      fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
      const existingLogs = fs.existsSync(logFilePath) ? 
        JSON.parse(fs.readFileSync(logFilePath, 'utf8')) : [];
      existingLogs.push(logEntry);
      fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2));
      console.log('Contact log written successfully');
    } catch (logErr) {
      console.error('Failed to log contact data:', logErr);
      // Continue processing even if logging fails
    }

    // Check email configuration
    const user = process.env.CONTACT_EMAIL_USER;
    const pass = process.env.CONTACT_EMAIL_PASS;
    if (!user || !pass) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const transporter = nodemailer.createTransporter({
      host: 'mail.smtp2go.com',
      port: 587,
      secure: false,
      auth: { user, pass }
    });

    // Test SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (smtpErr) {
      console.error('SMTP connection failed:', smtpErr);
      return res.status(500).json({ error: 'Email service temporarily unavailable' });
    }

    // Send email
    await transporter.sendMail({
      from: 'autodevelop@cbsdelivery.com',
      to: 'kev7n11@outlook.com',
      subject: `DOMAIN INQUIRY: ${sanitizedData.subject}`,
      text: `Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nTelephone: ${sanitizedData.telephone}\nSubject: ${sanitizedData.subject}\nMessage: ${sanitizedData.msg}`
    });

    res.status(200).json({ success: true, message: 'Contact form submitted successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to process contact form. Please try again.' });
  }
});

module.exports = router;
const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, telephone, subject, msg } = req.body || {};
  if (!name || !email || !telephone || !subject || !msg) {
    res.status(400).json({ error: 'All fields required' });
    return;
  }

  // Log contact data to a file
  const logFilePath = path.join(__dirname, '../logs/contact_logs.json'); // Use persistent 'logs/' directory
  const logEntry = { name, email, telephone, subject, msg, timestamp: new Date().toISOString() };
  try {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true }); // Ensure the directory exists
    const existingLogs = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath, 'utf8')) : [];
    existingLogs.push(logEntry);
    fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2));
    console.log('Log written to:', logFilePath);
  } catch (err) {
    console.error('Failed to log contact data:', err);
  }

  // Use environment variables for email credentials
  const user = process.env.CONTACT_EMAIL_USER;
  const pass = process.env.CONTACT_EMAIL_PASS;
  if (!user || !pass) {
    res.status(500).json({ error: 'Email service not configured' });
    return;
  }
  console.log('Email User:', user);
  console.log('Email Pass:', pass ? '******' : 'Not Set');

  const transporter = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user, // SMTP2GO username from environment variable
      pass // SMTP2GO password from environment variable
    }
  });

  // Test SMTP connection
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully.');
  } catch (err) {
    console.error('SMTP connection failed:', err);
    res.status(500).json({ error: 'SMTP connection failed' });
    return;
  }

  try {
    await transporter.sendMail({
      from: 'autodevelop@cbsdelivery.com', // Use the correct email address
      to: 'kev7n11@outlook.com',
      subject: `BUY THIS DOMAIN MSG: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nTelephone: ${telephone}\nSubject: ${subject}\nMessage: ${msg}`
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Failed to send email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;

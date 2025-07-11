// api/contact.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { name, email, msg } = req.body || {};
  if (!name || !email || !msg) {
    res.status(400).json({ error: 'All fields required' });
    return;
  }
  // Use environment variables for email credentials
  const user = process.env.CONTACT_EMAIL_USER;
  const pass = process.env.CONTACT_EMAIL_PASS;
  if (!user || !pass) {
    res.status(500).json({ error: 'Email service not configured' });
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
  try {
    await transporter.sendMail({
      from: user,
      to: 'kev7n11@outlook.com',
      subject: 'Domain Purchase Inquiry',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${msg}`
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
};

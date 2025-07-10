// Required environment variables:
// OPENAI_API_KEY         - API key for OpenAI
// STRIPE_SECRET_KEY      - Secret key for Stripe API
// STRIPE_WEBHOOK_SECRET  - Secret for verifying Stripe webhooks
// CLIENT_SUCCESS_URL     - (Optional) URL to redirect after successful Stripe checkout
// CLIENT_CANCEL_URL      - (Optional) URL to redirect after canceled Stripe checkout

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const Stripe = require('stripe');
const app = express();

// ✅ Load environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ✅ Serve React static files
const clientPath = path.join(__dirname, 'client/build');
app.use(express.static(clientPath));

// ✅ Parse JSON body for all non-webhook routes
app.use(express.json());

// 💬 Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || 'No response';
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// 💳 Stripe webhook (raw body needed only here)
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      endpointSecret
    );

    // ✅ Confirm session type
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('✅ Subscription successful:', session.id);
      // You could trigger internal logic here (e.g. mark user as premium)
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('🚨 Webhook verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: 'price_1Rh6KIFqLK5Bra1AWQ9fYf0q', quantity: 1 }], // Replace with actual Stripe price ID
      success_url: process.env.CLIENT_SUCCESS_URL || 'https://autodevelop.ai/success',
      cancel_url: process.env.CLIENT_CANCEL_URL || 'http://autodevelop.ai. /cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('🚨 Stripe session creation failed:', err.message);

    if (err.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'Invalid Stripe configuration or price ID.' });
    }

    res.status(500).json({ error: err.message || 'Stripe error.' });
  }
});
// ✅ Success & cancel pages
app.get('/success', (req, res) => res.send('Subscription successful!'));
app.get('/cancel', (req, res) => res.send('Subscription canceled.'));

// 🎯 Wildcard route for React SPA (fallback to index.html)
app.use((req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// 🔊 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

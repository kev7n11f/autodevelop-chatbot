const Stripe = require('stripe');
const bodyParser = require('body-parser');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      endpointSecret
    );
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('✅ Subscription successful:', session.id);
    }
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('🚨 Webhook verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

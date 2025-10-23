import { config } from 'dotenv';
config({ path: '.env.local' });
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-08-27.basil' });

(async () => {
  const products = await stripe.products.list({ active: true, limit: 100 });

  for (const product of products.data) {
    const prices = await stripe.prices.list({ product: product.id, active: true });
    if (prices.data.length > 0) {
      const price = prices.data[0];
      const amount = price.unit_amount ? price.unit_amount / 100 : 0;
      console.log(`${product.name}: ${price.id} ($${amount}/month)`);
    }
  }
})().catch(console.error);

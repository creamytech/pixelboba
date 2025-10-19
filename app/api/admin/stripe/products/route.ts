import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch products with their prices
    const products = await stripe.products.list({
      active: true,
      limit: 100,
      expand: ['data.default_price'],
    });

    // Fetch all prices for products
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
        });

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          defaultPrice: product.default_price,
          prices: prices.data.map((price) => ({
            id: price.id,
            currency: price.currency,
            unitAmount: price.unit_amount,
            recurring: price.recurring,
            type: price.type,
          })),
        };
      })
    );

    return NextResponse.json({ products: productsWithPrices });
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

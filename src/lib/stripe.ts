import { loadStripe } from '@stripe/stripe-js';

// Stripe configuration
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : null;

// Stripe integration functions
export async function createCheckoutSession(planId: string, userId: string) {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      planId,
      userId,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }
  
  const { sessionId } = await response.json();
  return sessionId;
}

export async function createPortalSession(customerId: string) {
  const response = await fetch('/api/stripe/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create portal session');
  }
  
  const { url } = await response.json();
  return url;
}


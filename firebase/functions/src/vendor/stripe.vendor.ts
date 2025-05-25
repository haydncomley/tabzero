import { CONFIG } from '../config';
import Stripe from 'stripe';

export const getStripe = () => new Stripe(CONFIG.stripe.key, {
    apiVersion: '2025-04-30.basil',
  });
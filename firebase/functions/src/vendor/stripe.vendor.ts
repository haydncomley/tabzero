import Stripe from 'stripe';
import { stripeKey } from '../config';

export const getStripe = () => new Stripe(stripeKey.value(), {
    apiVersion: '2025-04-30.basil',
  });
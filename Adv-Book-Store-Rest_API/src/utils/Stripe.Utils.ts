import Stripe from 'stripe'
const stripe = new Stripe(`${process.env.STRIPE_P_KEY}`);

export default stripe
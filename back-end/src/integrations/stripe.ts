import { stripeKey } from "../connect";

const stripe = require('stripe')(stripeKey)

export { stripe }
import express from 'express';
import Stripe from 'stripe';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { verifyToken } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Checkout Session
router.post('/create-checkout-session', verifyToken, async (req, res) => {
    const { planId } = req.body; // e.g., 'price_123...'

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: planId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: 'http://localhost:5173/dashboard?success=true',
            cancel_url: 'http://localhost:5173/dashboard?canceled=true',
            client_reference_id: req.user.user_id.toString()
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Stripe Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Fulfill the purchase...
        const userId = session.client_reference_id;
        const customerId = session.customer;

        // In a real app we'd map the plan ID to a plan name
        try {
            await pool.query(
                'UPDATE users SET subscription_plan = $1, stripe_customer_id = $2 WHERE id = $3',
                ['Pro', customerId, parseInt(userId)]
            );
            console.log(`Upgraded user ${userId} to Pro`);
        } catch (dbErr) {
            console.error('Webhook DB Error:', dbErr);
        }
    }

    res.json({ received: true });
});

export default router;

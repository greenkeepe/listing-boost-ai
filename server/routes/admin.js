import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { verifyToken } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Simple middleware to check if user is admin 
// (In a real app, user table would have an 'is_admin' or 'role' column)
const verifyAdmin = (req, res, next) => {
    // Mock check for demo purposes
    if (req.user && req.user.email === 'admin@listingboost.ai') {
        return next();
    }
    return res.status(403).json({ error: 'Admin access required' });
};

// Get platform stats
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        const analysisCount = await pool.query('SELECT COUNT(*) FROM analysis_reports');

        // Revenue mock - in reality query from Stripe API
        const mrr = 1250;

        res.json({
            success: true,
            stats: {
                totalUsers: parseInt(userCount.rows[0].count),
                totalAnalyses: parseInt(analysisCount.rows[0].count),
                monthlyRecurringRevenue: `$${mrr}`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
});

// Get all users
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await pool.query('SELECT id, email, subscription_plan, created_at FROM users ORDER BY created_at DESC LIMIT 50');
        res.json({ success: true, users: users.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
});

export default router;

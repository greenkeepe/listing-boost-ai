import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({ success: false, error: 'All input is required' });
        }

        // Check if user exists
        const oldUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (oldUser.rows.length > 0) {
            return res.status(409).json({ success: false, error: 'User Already Exists. Please Login' });
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, subscription_plan',
            [email.toLowerCase(), encryptedPassword]
        );

        // Create token
        const token = jwt.sign(
            { user_id: newUser.rows[0].id, email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({ success: true, user: newUser.rows[0], token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Error registering user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({ success: false, error: 'All input is required' });
        }

        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            // Create token
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            res.status(200).json({
                success: true,
                user: { id: user.id, email: user.email, subscription_plan: user.subscription_plan },
                token
            });
        } else {
            res.status(400).json({ success: false, error: 'Invalid Credentials' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Error logging in' });
    }
});

export default router;

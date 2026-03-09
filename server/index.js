import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import analysisRouter from './routes/analysis.js';
import authRouter from './routes/auth.js';
import paymentRouter from './routes/payment.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Webhook must be raw body, so mount it BEFORE express.json()
app.use('/api/payment/webhook', paymentRouter);

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/analyze', analysisRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/admin', adminRouter);

app.get('/api', (req, res) => {
    res.send('ListingBoost AI API is running');
});

// Serve frontend in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server if not running on Vercel
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;

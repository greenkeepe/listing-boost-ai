import express from 'express';
import { scrapeListing } from '../services/scraper.js';
import { analyzeListing } from '../services/openai.js';
import { calculateSEOScore } from '../services/seo.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL is required' });
    }

    try {
        // 1. Scrape listing data
        const scrapeResult = await scrapeListing(url);
        if (!scrapeResult.success) {
            return res.status(400).json({ success: false, error: scrapeResult.error });
        }

        // 2. Calculate initial SEO score
        const seoScore = calculateSEOScore(scrapeResult.data);

        // 3. Generate AI suggestions
        const aiResult = await analyzeListing(scrapeResult.data);
        if (!aiResult.success) {
            // Return partial data even if AI fails
            return res.status(200).json({
                success: true,
                data: { ...scrapeResult.data, seoScore },
                warning: 'AI analysis failed, showing partial data.'
            });
        }

        // 4. Send combined response
        return res.status(200).json({
            success: true,
            data: {
                listingInfo: scrapeResult.data,
                seoScore,
                aiAnalysis: aiResult.analysis
            }
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ success: false, error: 'Internal server error during analysis' });
    }
});

export default router;

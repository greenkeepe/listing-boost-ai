/**
 * Calculates a mock Airbnb SEO score based on listing data.
 * In a real app, this would use a complex algorithm considering
 * keyword density, photo count, reviews, amenities, etc.
 */
export const calculateSEOScore = (listingData) => {
    let score = 50; // Base score

    if (!listingData.title || !listingData.description) {
        return 10;
    }

    // Title length optimization (Airbnb prefers 50-70 characters)
    const titleLength = listingData.title.length;
    if (titleLength >= 50 && titleLength <= 70) {
        score += 15;
    } else if (titleLength > 30) {
        score += 5;
    }

    // Description length
    if (listingData.description.length > 500) {
        score += 15;
    } else if (listingData.description.length > 200) {
        score += 5;
    }

    // Include some random variability just for the MVP
    score += Math.floor(Math.random() * 20);

    // Cap at 100
    return Math.min(100, Math.max(0, score));
};

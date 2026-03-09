import React, { useState } from 'react';
import { ArrowRight, BarChart3, Star, CheckCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    const handleAnalyze = (e) => {
        e.preventDefault();
        if (url.includes('airbnb.')) {
            navigate(`/analyze?url=${encodeURIComponent(url)}`);
        } else {
            alert("Please enter a valid Airbnb URL (e.g. airbnb.com or airbnb.it)");
        }
    };

    return (
        <div className="landing-page">
            <section className="hero-section">
                <div className="container hero-content">
                    <div className="hero-badge animate-fade-in">✨ AI-Powered Airbnb Optimization</div>
                    <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Get More Bookings with <span className="text-gradient">AI Insights</span>
                    </h1>
                    <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Analyze your Airbnb listing in seconds. Get AI-driven suggestions to improve your title, description, pricing, and visibility to beat the competition.
                    </p>

                    <form className="hero-form animate-fade-in" style={{ animationDelay: '0.3s' }} onSubmit={handleAnalyze}>
                        <input
                            type="url"
                            placeholder="Paste your Airbnb listing URL here..."
                            className="hero-input"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary btn-large">
                            Analyze Listing <ArrowRight size={20} className="ml-2" />
                        </button>
                    </form>

                    <p className="hero-trust animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        Trusted by active hosts and property managers worldwide.
                    </p>
                </div>
            </section>

            <section className="features-section" id="features">
                <div className="container">
                    <h2 className="section-title">Everything you need to rank higher</h2>
                    <div className="features-grid">
                        <div className="feature-card card">
                            <div className="feature-icon-wrapper"><BarChart3 size={24} className="feature-icon" /></div>
                            <h3>SEO Score Analysis</h3>
                            <p>Get a comprehensive score from 0-100 based on your listing's current optimization level.</p>
                        </div>

                        <div className="feature-card card">
                            <div className="feature-icon-wrapper"><Star size={24} className="feature-icon" /></div>
                            <h3>AI Copy Generator</h3>
                            <p>Instantly generate high-converting, multi-language descriptions specifically tailored to your property.</p>
                        </div>

                        <div className="feature-card card">
                            <div className="feature-icon-wrapper"><CheckCircle size={24} className="feature-icon" /></div>
                            <h3>Improvement Checklist</h3>
                            <p>Actionable, step-by-step checklist to fix missing amenities, photo ordering, and weak titles.</p>
                        </div>

                        <div className="feature-card card">
                            <div className="feature-icon-wrapper"><TrendingUp size={24} className="feature-icon" /></div>
                            <h3>Competitor Discovery</h3>
                            <p>See exactly what top-performing listings in your area are doing right and what you can copy.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

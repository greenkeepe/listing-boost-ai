import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, Clock, ArrowRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    // Mock data for visualization
    const [listings, setListings] = useState([
        {
            id: 1,
            title: 'Cozy City Center Apartment',
            url: 'https://airbnb.com/rooms/123456',
            seoScore: 65,
            lastAnalyzed: '2026-03-08T10:00:00Z',
        },
        {
            id: 2,
            title: 'Luxury Villa with Pool',
            url: 'https://airbnb.com/rooms/789012',
            seoScore: 88,
            lastAnalyzed: '2026-03-09T08:30:00Z',
        }
    ]);

    const [newUrl, setNewUrl] = useState('');

    // Temporarily bypass real auth check for MVP display
    // useEffect(() => {
    //   const token = localStorage.getItem('token');
    //   if (!token) navigate('/login');
    // }, []);

    const handleAnalyzeNew = (e) => {
        e.preventDefault();
        if (newUrl) {
            navigate(`/analyze?url=${encodeURIComponent(newUrl)}`);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--color-success)';
        if (score >= 50) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    return (
        <div className="dashboard container">
            <div className="dashboard-header">
                <div>
                    <h1>Your Dashboard</h1>
                    <p>Manage your listings and track your Airbnb SEO improvements.</p>
                </div>
                <div className="subscription-badge">Pro Plan</div>
            </div>

            <div className="dashboard-stats grid-3">
                <div className="stat-card card">
                    <div className="stat-icon"><BarChart3 size={24} /></div>
                    <div className="stat-info">
                        <h3>Average SEO Score</h3>
                        <div className="stat-value">76.5</div>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-info">
                        <h3>Analyses This Month</h3>
                        <div className="stat-value">12 / 100</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-actions card glass">
                    <h2>Analyze New Listing</h2>
                    <form className="analyze-form" onSubmit={handleAnalyzeNew}>
                        <input
                            type="url"
                            placeholder="Paste Airbnb URL here..."
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary">
                            Analyze <ArrowRight size={18} className="ml-2" />
                        </button>
                    </form>
                </div>

                <div className="listings-section mt-4">
                    <h2>Your Analyzed Listings</h2>
                    {listings.length === 0 ? (
                        <div className="card text-center empty-state">
                            <p>You haven't analyzed any listings yet.</p>
                        </div>
                    ) : (
                        <div className="listings-grid">
                            {listings.map(listing => (
                                <div key={listing.id} className="listing-card card">
                                    <div className="listing-header">
                                        <h3 className="truncate">{listing.title}</h3>
                                        <div className="listing-score" style={{ backgroundColor: getScoreColor(listing.seoScore) + '20', color: getScoreColor(listing.seoScore) }}>
                                            {listing.seoScore}
                                        </div>
                                    </div>
                                    <a href={listing.url} target="_blank" rel="noreferrer" className="listing-url truncate">
                                        {listing.url}
                                    </a>
                                    <div className="listing-footer">
                                        <span className="last-analyzed">
                                            Analyzed: {new Date(listing.lastAnalyzed).toLocaleDateString()}
                                        </span>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => navigate(`/analyze?url=${encodeURIComponent(listing.url)}`)}
                                        >
                                            View Report
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

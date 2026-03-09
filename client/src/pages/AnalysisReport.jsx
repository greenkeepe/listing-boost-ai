import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, TrendingUp, Sparkles, Image as ImageIcon } from 'lucide-react';
import './AnalysisReport.css';

const AnalysisReport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState('');

    const url = new URLSearchParams(location.search).get('url');

    useEffect(() => {
        if (!url) {
            navigate('/');
            return;
        }

        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                // Assuming backend runs on 5000 in dev
                const response = await axios.post('http://localhost:5000/api/analyze', { url });
                if (response.data.success) {
                    setReportData(response.data.data);
                } else {
                    setError(response.data.error || 'Failed to analyze listing.');
                }
            } catch (err) {
                setError('Failed to connect to the analysis engine. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [url, navigate]);

    if (loading) {
        return (
            <div className="analysis-loading container">
                <Loader2 className="spinner" size={48} />
                <h2>Analyzing your listing...</h2>
                <p>Our AI is reading your description, evaluating photos, and calculating your SEO score. This takes about 10-15 seconds.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analysis-error container">
                <AlertCircle size={48} color="var(--color-danger)" />
                <h2>Analysis Failed</h2>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    <ArrowLeft size={16} className="mr-2" /> Try Another Listing
                </button>
            </div>
        );
    }

    const { listingInfo, seoScore, aiAnalysis } = reportData;

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--color-success)';
        if (score >= 50) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    return (
        <div className="analysis-report container">
            <button className="back-link" onClick={() => navigate('/')}>
                <ArrowLeft size={16} /> Back to Home
            </button>

            <header className="report-header">
                <div className="report-title-area">
                    <h1>Listing Analysis Report</h1>
                    <a href={listingInfo.url} target="_blank" rel="noreferrer" className="listing-url">
                        {listingInfo.title || 'View Listing on Airbnb'}
                    </a>
                </div>

                <div className="score-card card" style={{ borderColor: getScoreColor(seoScore) }}>
                    <div className="score-circle" style={{ color: getScoreColor(seoScore) }}>
                        <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle" strokeDasharray={`${seoScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <text x="18" y="20.35" className="percentage">{seoScore}</text>
                        </svg>
                    </div>
                    <div className="score-text">
                        <h3>SEO Score</h3>
                        <p>Based on Airbnb algorithm best practices</p>
                    </div>
                </div>
            </header>

            <div className="report-grid">
                <div className="report-main">
                    {aiAnalysis ? (
                        <>
                            <section className="report-section card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <h2 className="section-header"><Sparkles size={20} /> AI Title Suggestions</h2>
                                <ul className="suggestion-list">
                                    {aiAnalysis.titleSuggestions?.map((title, i) => (
                                        <li key={i} className="suggestion-item">
                                            <span className="bullet"></span> {title}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="report-section card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <h2 className="section-header"><TrendingUp size={20} /> Description Improvements</h2>
                                <ul className="suggestion-list">
                                    {aiAnalysis.descriptionImprovements?.map((desc, i) => (
                                        <li key={i} className="suggestion-item">
                                            <span className="bullet"></span> {desc}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="report-section card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                <h2 className="section-header"><ImageIcon size={20} /> Photo Tips</h2>
                                <ul className="suggestion-list">
                                    {aiAnalysis.photoTips?.map((tip, i) => (
                                        <li key={i} className="suggestion-item">
                                            <span className="bullet"></span> {tip}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </>
                    ) : (
                        <div className="card">AI Analysis not available. Please try again.</div>
                    )}
                </div>

                <div className="report-sidebar">
                    {aiAnalysis && (
                        <div className="checklist-card card animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <h3><CheckCircle2 size={20} className="mr-2" /> Action Plan</h3>
                            <div className="checklist">
                                {aiAnalysis.improvementChecklist?.map((item, i) => (
                                    <label key={i} className="checklist-item">
                                        <input type="checkbox" />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {aiAnalysis?.pricingAdvice && (
                        <div className="pricing-card card animate-fade-in" style={{ animationDelay: '0.5s' }}>
                            <h3>Pricing Advice</h3>
                            <p>{aiAnalysis.pricingAdvice}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalysisReport;

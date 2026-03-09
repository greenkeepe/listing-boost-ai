import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className="header glass">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <Sparkles className="logo-icon" size={24} />
                    <span className="logo-text">ListingBoost AI</span>
                </Link>

                <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                    <Link to="#features" className="nav-link">Features</Link>
                    <Link to="#pricing" className="nav-link">Pricing</Link>
                    <div className="nav-actions">
                        <Link to="/login" className="btn btn-secondary">Log In</Link>
                        <Link to="/signup" className="btn btn-primary">Start Free Trial</Link>
                    </div>
                </nav>

                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
};

export default Header;

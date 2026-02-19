import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer glass-panel" style={{
            marginTop: '3rem',
            padding: '2rem',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderRadius: '16px 16px 0 0'
        }}>
            <div className="footer-links">
                <a href="https://www.instagram.com/bingoplay.co.in?igsh=MXY4cGtucGhydTZycQ==" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', fontSize: '1.8rem', display: 'flex', alignItems: 'center', transition: 'transform 0.3s' }} className="instagram-link">
                    <FaInstagram />
                </a>
            </div>

            <div className="footer-info">
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '5px' }}>
                    Ritesh & Sahil
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    Made with ❤️ in Bharat <span>🇮🇳</span>
                </p>
            </div>

            <div className="footer-bottom-links" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
                <Link to="/privacy" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.85rem', opacity: 0.7 }}>Privacy Policy</Link>
                <Link to="/terms" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.85rem', opacity: 0.7 }}>Terms of Service</Link>
            </div>

            <div className="footer-copyright" style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                © {new Date().getFullYear()} Bingo! All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;

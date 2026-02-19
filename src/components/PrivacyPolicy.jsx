import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="privacy-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <button
                onClick={() => navigate('/')}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}
            >
                <FaArrowLeft /> Back to Home
            </button>

            <div className="glass-panel" style={{ padding: '2rem', lineHeight: '1.6' }}>
                <h1 style={{ color: 'var(--secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>Privacy Policy</h1>

                <p style={{ marginBottom: '1rem' }}>Last updated: February 18, 2026</p>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>1. Introduction</h2>
                    <p>Welcome to Bingo! We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>2. Data We Collect</h2>
                    <p>We may collect limited data such as:</p>
                    <ul>
                        <li>Account information (if logged in via Google or Facebook)</li>
                        <li>Game statistics and scores</li>
                        <li>Temporary session data for multiplayer rooms</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>3. How We Use Your Data</h2>
                    <p>We use your data to provide and improve our Bingo game, manage your account, and facilitate multiplayer interactions.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>4. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, you can contact us via our Instagram.</p>
                </section>

                <p style={{ textAlign: 'center', opacity: 0.7, marginTop: '2rem' }}>
                    Made with ❤️ in Bharat 🇮🇳
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

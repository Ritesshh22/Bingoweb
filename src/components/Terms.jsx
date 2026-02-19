import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="terms-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <button
                onClick={() => navigate('/')}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}
            >
                <FaArrowLeft /> Back to Home
            </button>

            <div className="glass-panel" style={{ padding: '2rem', lineHeight: '1.6' }}>
                <h1 style={{ color: 'var(--secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>Terms of Service</h1>

                <p style={{ marginBottom: '1rem' }}>Last updated: February 18, 2026</p>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h2>
                    <p>By accessing and playing Bingo!, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>2. Use License</h2>
                    <p>This is a free-to-play game for personal, non-commercial use. You may not modify, copy, or attempt to decompile the game logic.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>3. Fair Play</h2>
                    <p>Users must play fairly. Any use of automated scripts or cheats is strictly prohibited and may result in a ban from multiplayer rooms.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>4. Disclaimer</h2>
                    <p>The game is provided "as is". We are not responsible for any connectivity issues or data loss during gameplay.</p>
                </section>

                <p style={{ textAlign: 'center', opacity: 0.7, marginTop: '2rem' }}>
                    Thank you for playing Bingo! 🇮🇳
                </p>
            </div>
        </div>
    );
};

export default Terms;

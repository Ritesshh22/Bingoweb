import React from 'react';
import { FaBook, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Rules = () => {
    const navigate = useNavigate();
    return (
        <div className="rules-container glass-panel" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'left' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--secondary)' }}>
                <FaBook /> How To Play Bingo
            </h2>

            <div className="rule-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                <FaCheck style={{ color: 'var(--primary)', marginTop: '5px' }} />
                <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>1. Create Your Grid</h4>
                    <p>You have a 5x5 grid. Numbers 1 to 25 are placed randomly. In our game, this is done automatically for you!</p>
                </div>
            </div>

            <div className="rule-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                <FaCheck style={{ color: 'var(--primary)', marginTop: '5px' }} />
                <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>2. Take Turns</h4>
                    <p>You and your opponent take turns picking a number. When a number is picked, it is marked off on BOTH players' grids.</p>
                </div>
            </div>

            <div className="rule-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                <FaCheck style={{ color: 'var(--primary)', marginTop: '5px' }} />
                <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>3. Make Lines</h4>
                    <p>The goal is to complete 5 full lines (rows, columns, or diagonals).</p>
                </div>
            </div>

            <div className="rule-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                <FaCheck style={{ color: 'var(--primary)', marginTop: '5px' }} />
                <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>4. BINGO!</h4>
                    <p>The first player to complete 5 lines wins the game!</p>
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />

            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--secondary)' }}>
                Play with Friends
            </h2>

            <div className="rule-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                <FaCheck style={{ color: 'var(--primary)', marginTop: '5px' }} />
                <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>Step 1: Create a Room</h4>
                    <p>Click the <b>"Create Room"</b> button to start a new game. You will be given a unique random code (e.g., AH7B2).</p>
                </div>
            </div>

            <div className="rule-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                <FaCheck style={{ color: 'var(--primary)', marginTop: '5px' }} />
                <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>Step 2: Share the Code</h4>
                    <p>Send the generated code to your friend. Use the <b>"Copy Code"</b> button for a quick share!</p>
                </div>
            </div>

            <div className="rule-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                <FaCheck style={{ color: 'var(--primary)', marginTop: '5px' }} />
                <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>Step 3: Friend Joins</h4>
                    <p>Your friend enters your code in the <b>"Join via Code"</b> box on the Home page and clicks Join.</p>
                </div>
            </div>

            <div className="rule-item" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                <FaCheck style={{ color: 'var(--primary)', marginTop: '5px' }} />
                <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>Step 4: Battle Starts</h4>
                    <p>Once you both are connected, take turns picking numbers. The first to hit <b>5 BINGO lines</b> wins the match!</p>
                </div>
            </div>

            <button onClick={() => navigate('/')} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Back to Home</button>
        </div>
    );
};

export default Rules;

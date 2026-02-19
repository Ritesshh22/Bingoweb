import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, facebookProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { FaPlay, FaUserFriends, FaQuestionCircle, FaGoogle, FaUserSecret } from 'react-icons/fa';

import Footer from './Footer';

const Landing = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [joinCode, setJoinCode] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (provider) => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error(error);
            alert("Login Failed: " + error.message);
        }
    };

    const handleJoinGame = () => {
        if (!user) {
            alert("Please login first!");
            return;
        }
        if (!joinCode || joinCode.length < 3) {
            alert("Please enter a valid code.");
            return;
        }
        navigate(`/multiplayer?join=${joinCode.toUpperCase()}`);
    };

    const handleGuestLogin = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error(error);
            alert("Guest Login Failed. Make sure 'Anonymous' sign-in is enabled in Firebase Console.");
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <div className="landing-container">
            <nav className="navbar glass-panel" style={{ padding: '10px 20px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'var(--primary)', margin: 0 }}>Bingo!</h3>
                {user ? (
                    <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="User" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}><FaUserSecret /></div>
                        )}
                        <span style={{ fontSize: '0.9rem' }}>{user.displayName || 'Guest Player'}</span>
                        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Logout</button>
                    </div>
                ) : (
                    <div className="login-options" style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handleGuestLogin} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', fontSize: '0.8rem' }}>
                            <FaUserSecret /> Guest
                        </button>
                        <button onClick={() => handleLogin(googleProvider)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', fontSize: '0.8rem' }}>
                            <FaGoogle /> Login
                        </button>
                    </div>
                )}
            </nav>

            <header className="hero glass-panel">
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--secondary)', textShadow: '0 0 20px rgba(0, 229, 255, 0.5)' }}>BINGO</h1>
                <p style={{ marginBottom: '2rem', opacity: 0.8 }}>Classic Game Reimagined</p>

                <div className="menu-options" style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
                    <button onClick={() => navigate('/play')} className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        <FaPlay /> Play Solo
                    </button>
                    <button
                        onClick={() => user ? navigate('/multiplayer?action=create') : alert('Please Login to play with friends!')}
                        className="btn-primary"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                    >
                        <FaUserFriends /> Create Room
                    </button>
                    <div className="glass-panel" style={{ marginTop: '1rem', padding: '1rem', border: '1px dashed var(--secondary)' }}>
                        <p style={{ fontSize: '0.8rem', marginBottom: '10px', opacity: 0.7 }}>Have a friend's code?</p>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                placeholder="ENTER CODE"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                className="input-glass"
                                style={{ textAlign: 'center' }}
                            />
                            <button onClick={handleJoinGame} className="btn-secondary" style={{ padding: '5px 15px' }}>Join</button>
                        </div>
                    </div>

                    <button onClick={() => navigate('/rules')} className="btn-secondary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', borderColor: 'transparent', opacity: 0.7, marginTop: '10px' }}>
                        <FaQuestionCircle /> How to Play
                    </button>
                </div>
            </header>

            <Footer />
        </div>
    );
};


export default Landing;

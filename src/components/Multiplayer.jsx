import React, { useState, useEffect, useCallback } from 'react';
import { database, auth } from '../firebase';
import { ref, set, onValue, update, get, off } from 'firebase/database';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaHome, FaCopy, FaUserFriends } from 'react-icons/fa';
import sounds from '../utils/SoundManager';
import confetti from 'canvas-confetti';

const WINNING_LINES = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], // Rows
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], // Cols
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20] // Diagonals
];

const checkWin = (marked, userGrid) => {
    if (!marked || !userGrid) return { count: 0, lines: [] };
    let linesComplete = 0;
    let completeIndices = [];
    WINNING_LINES.forEach((line, index) => {
        if (line.every(idx => marked.includes(userGrid[idx]))) {
            linesComplete++;
            completeIndices.push(index);
        }
    });
    return { count: linesComplete, lines: completeIndices };
};

const generateGrid = () => {
    let nums = Array.from({ length: 25 }, (_, i) => i + 1);
    nums.sort(() => Math.random() - 0.5);
    return nums;
};

const generateRandomCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();

const Multiplayer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [roomId, setRoomId] = useState('');
    const [view, setView] = useState('lobby'); // lobby, waiting, playing, result
    const [gameData, setGameData] = useState(null);
    const [myGrid, setMyGrid] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = auth.currentUser;

    const navigateHome = () => {
        if (roomId) off(ref(database, 'rooms/' + roomId));
        window.location.href = '/';
    };

    const listenToRoom = useCallback((id) => {
        console.log("Listening to room:", id);
        setRoomId(id);
        const roomRef = ref(database, 'rooms/' + id);
        onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setGameData(data);
                if (data.winner) setView('result');
                else if (data.status === 'playing') setView('playing');
                else if (data.status === 'waiting') setView('waiting');

                if (data.players && data.players[user.uid]) {
                    setMyGrid(data.players[user.uid].grid);
                }
            } else {
                setView('lobby');
            }
        });
    }, [user?.uid]);

    const createRoom = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        const newId = generateRandomCode();
        console.log("Creating room:", newId);
        const timer = setTimeout(() => {
            if (loading) {
                setLoading(false);
                alert("Connection Timeout: Could not reach the Bingo server. Please check your internet or Firebase 'Database URL' setting.");
                navigate('/');
            }
        }, 12000);

        try {
            const grid = generateGrid();
            const roomRef = ref(database, 'rooms/' + newId);
            await set(roomRef, {
                host: user.uid,
                turn: user.uid,
                status: 'waiting',
                marked: [],
                players: {
                    [user.uid]: {
                        name: user.displayName || 'Guest Player',
                        grid: grid,
                        score: 0
                    }
                }
            });
            clearTimeout(timer);
            setMyGrid(grid);
            listenToRoom(newId);
        } catch (e) {
            clearTimeout(timer);
            console.error(e);
            alert("Error: " + e.message);
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [user?.uid, loading, listenToRoom, navigate]);

    const joinRoom = useCallback(async (id) => {
        if (loading) return;
        setLoading(true);
        console.log("Joining room:", id);
        try {
            const roomRef = ref(database, 'rooms/' + id);
            const snapshot = await get(roomRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data.status !== 'waiting') {
                    alert("Room is full or game started!");
                    navigate('/');
                    return;
                }
                const grid = generateGrid();
                await update(roomRef, {
                    [`players/${user.uid}`]: {
                        name: user.displayName || 'Guest Player',
                        grid: grid,
                        score: 0
                    },
                    status: 'playing'
                });
                setMyGrid(grid);
                listenToRoom(id);
            } else {
                alert("Room not found!");
                navigate('/');
            }
        } catch (e) {
            console.error(e);
            alert("Error: " + e.message);
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [user?.uid, loading, listenToRoom, navigate]);

    useEffect(() => {
        if (!user) {
            alert("Login required!");
            navigate('/');
            return;
        }
        const params = new URLSearchParams(location.search);
        const action = params.get('action');
        const joinId = params.get('join');

        if (action === 'create' && !roomId && !loading) {
            createRoom();
        } else if (joinId && !roomId && !loading) {
            joinRoom(joinId);
        }
    }, [location.search, user, roomId, loading, createRoom, joinRoom, navigate]);

    useEffect(() => {
        if (gameData?.marked?.length > 0) sounds.playClick();
    }, [gameData?.marked?.length]);

    useEffect(() => {
        if (gameData?.winner === user.uid) {
            sounds.playWin();
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else if (gameData?.winner) {
            sounds.playLose();
        }
    }, [gameData?.winner, user.uid]);

    const playTurn = async (number) => {
        if (!gameData || gameData.turn !== user.uid || gameData.winner) return;
        if (gameData.marked?.includes(number)) return;

        const newMarked = [...(gameData.marked || []), number];
        const updates = {};
        updates[`rooms/${roomId}/marked`] = newMarked;

        const playerIds = Object.keys(gameData.players);
        const nextPlayer = playerIds.find(id => id !== user.uid);
        updates[`rooms/${roomId}/turn`] = nextPlayer;

        const myWinData = checkWin(newMarked, myGrid);
        updates[`rooms/${roomId}/players/${user.uid}/score`] = myWinData.count;

        let oppScore = 0;
        if (nextPlayer && gameData.players[nextPlayer]) {
            const oppWinData = checkWin(newMarked, gameData.players[nextPlayer].grid);
            oppScore = oppWinData.count;
            updates[`rooms/${roomId}/players/${nextPlayer}/score`] = oppScore;
        }

        if (myWinData.count >= 5 && oppScore >= 5) updates[`rooms/${roomId}/winner`] = 'DRAW';
        else if (myWinData.count >= 5) updates[`rooms/${roomId}/winner`] = user.uid;
        else if (oppScore >= 5) updates[`rooms/${roomId}/winner`] = nextPlayer;

        await update(ref(database), updates);
    };

    if (loading && view === 'lobby') {
        return (
            <div className="glass-panel" style={{ margin: '4rem auto', maxWidth: '400px' }}>
                <div className="spinner" style={{ border: '4px solid rgba(255,100,200,0.3)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <h3>Synchronizing with Game Server...</h3>
                <p style={{ opacity: 0.7, marginTop: '10px' }}>Establishing secure connection</p>
            </div>
        );
    }

    if (view === 'waiting') {
        return (
            <div className="glass-panel" style={{ maxWidth: '450px', margin: '2rem auto' }}>
                <h2 style={{ color: 'var(--secondary)' }}>Ready to Play!</h2>
                <div style={{ margin: '2rem 0', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '2px dashed var(--primary)' }}>
                    <p style={{ opacity: 0.7, marginBottom: '10px' }}>Your Room Code:</p>
                    <h1 style={{ fontSize: '3.5rem', letterSpacing: '5px', color: 'var(--primary)' }}>{roomId}</h1>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(roomId); alert("Copied!"); }} className="btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>
                    <FaCopy /> Copy Code
                </button>
                <p style={{ opacity: 0.8 }}>Waiting for your opponent to enter this code...</p>
                <button onClick={navigateHome} className="btn-secondary" style={{ marginTop: '2rem', border: 'none', opacity: 0.6 }}>Quit Setup</button>
            </div>
        );
    }

    if (view === 'playing' || view === 'result') {
        const isMyTurn = gameData?.turn === user?.uid;
        const myWinData = checkWin(gameData?.marked || [], myGrid);
        const opponentId = Object.keys(gameData?.players || {}).find(id => id !== user.uid);
        const oppName = gameData?.players[opponentId]?.name || 'Opponent';
        const oppScore = gameData?.players[opponentId]?.score || 0;

        return (
            <div className="game-room" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem' }}>
                        <div>YOU: <span style={{ color: 'var(--primary)' }}>{myWinData.count}/5</span></div>
                        <div>{oppName.toUpperCase()}: <span style={{ color: 'var(--secondary)' }}>{oppScore}/5</span></div>
                    </div>

                    <h1 className="pulse" style={{ color: 'var(--primary)', letterSpacing: '10px' }}>BINGO</h1>

                    <div style={{ margin: '1rem 0', color: isMyTurn ? 'var(--secondary)' : '#888', fontWeight: 'bold' }}>
                        {isMyTurn ? "● YOUR TURN" : "○ OPPONENT'S TURN"}
                    </div>

                    <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px', position: 'relative' }}>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
                            {myWinData.lines.map(idx => {
                                let x1, y1, x2, y2;
                                if (idx < 5) { x1 = '0%'; x2 = '100%'; y1 = y2 = `${idx * 20 + 10}%`; }
                                else if (idx < 10) { x1 = x2 = `${(idx - 5) * 20 + 10}%`; y1 = '0%'; y2 = '100%'; }
                                else if (idx === 10) { x1 = '0%'; y1 = '0%'; x2 = '100%'; y2 = '100%'; }
                                else { x1 = '100%'; y1 = '0%'; x2 = '0%'; y2 = '100%'; }
                                return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" />;
                            })}
                        </svg>
                        {myGrid.map((num, i) => {
                            const isMarked = gameData?.marked?.includes(num);
                            return (
                                <div key={i} onClick={() => !isMarked && isMyTurn && playTurn(num)}
                                    className={`grid-cell ${isMarked ? 'marked' : ''}`}
                                    style={{
                                        aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isMarked ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem',
                                        color: isMarked ? 'white' : 'var(--secondary)',
                                        cursor: isMyTurn && !isMarked ? 'pointer' : 'default',
                                        boxShadow: isMarked ? '0 0 10px rgba(255,0,85,0.5)' : 'none'
                                    }}>
                                    {num}
                                </div>
                            );
                        })}
                    </div>

                    {view === 'result' && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <h1 style={{ fontSize: '4rem', color: gameData.winner === user.uid ? '#00ff88' : '#ff0055' }}>
                                {gameData.winner === user.uid ? 'VICTORY!' : 'DEFEAT!'}
                            </h1>
                            <div style={{ fontSize: '5rem', margin: '1rem' }}>
                                {gameData.winner === user.uid ? '👑' : '☠️'}
                            </div>
                            <button className="btn-primary" onClick={navigateHome}>Back to Menu</button>
                        </div>
                    )}
                </div>
                <button onClick={navigateHome} className="btn-secondary" style={{ marginTop: '2rem', opacity: 0.6 }}>Exit Game</button>
            </div>
        );
    }

    return null;
};

export default Multiplayer;

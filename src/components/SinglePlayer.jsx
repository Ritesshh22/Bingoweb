import React, { useState, useEffect } from 'react';
import { FaRobot, FaUser, FaUndo } from 'react-icons/fa';
import sounds from '../utils/SoundManager';
import confetti from 'canvas-confetti';

const WINNING_LINES = [
    // Rows
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    // Cols
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
];

const SinglePlayer = () => {
    const [status, setStatus] = useState('setup'); // setup, playing, end
    const [headerText, setHeaderText] = useState('Setup Your Board');
    const [grid, setGrid] = useState(Array(25).fill(null));
    const [marked, setMarked] = useState([]); // Array of numbers marked
    const [wonLines, setWonLines] = useState([]); // Array of winning line indices

    // Robot State
    const [robotGrid, setRobotGrid] = useState([]);
    const [robotMarked, setRobotMarked] = useState([]);

    const [turn, setTurn] = useState('player'); // player, robot

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (status === 'playing') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [status]);

    // Initialize Grid with 1-25 randomized
    const randomizeGrid = () => {
        let nums = Array.from({ length: 25 }, (_, i) => i + 1);
        nums.sort(() => Math.random() - 0.5);
        setGrid(nums);
    };

    useEffect(() => {
        randomizeGrid();
    }, []);

    const startGame = () => {
        if (grid.some(n => n === null)) {
            randomizeGrid();
        }
        sounds.init();
        // Setup Robot Grid
        let robotNums = Array.from({ length: 25 }, (_, i) => i + 1);
        robotNums.sort(() => Math.random() - 0.5);
        setRobotGrid(robotNums);

        setStatus('playing');
        setHeaderText('Your Turn');
    };

    const checkWin = (currentMarked, currentGrid) => {
        let linesComplete = 0;
        let completeIndices = [];
        WINNING_LINES.forEach((line, index) => {
            const isComplete = line.every(index => currentMarked.includes(currentGrid[index]));
            if (isComplete) {
                linesComplete++;
                completeIndices.push(index);
            }
        });
        return { count: linesComplete, lines: completeIndices };
    };

    const handleCellClick = (number) => {
        if (status !== 'playing' || turn !== 'player' || marked.includes(number)) return;
        playTurn(number);
    };

    const playTurn = (number) => {
        const newMarked = [...marked, number];
        setMarked(newMarked);

        if (turn === 'player') sounds.playClick();
        else sounds.playRobotMove();

        const newRobotMarked = [...robotMarked, number];
        setRobotMarked(newRobotMarked);

        const playerWinData = checkWin(newMarked, grid);
        setWonLines(playerWinData.lines);

        const robotWinData = checkWin(newRobotMarked, robotGrid);

        const playerWins = playerWinData.count >= 5;
        const robotWins = robotWinData.count >= 5;

        if (playerWins && robotWins) {
            endGame('Draw!');
            return;
        }
        if (playerWins) {
            sounds.playWin();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF0055', '#00E5FF', '#ffffff']
            });
            endGame('You Won! BINGO!');
            return;
        }
        if (robotWins) {
            sounds.playLose();
            endGame('Robot Won! BINGO!');
            return;
        }

        setTurn(prev => prev === 'player' ? 'robot' : 'player');
    };

    useEffect(() => {
        if (status === 'playing' && turn === 'robot') {
            setHeaderText("Robot is thinking...");
            const timer = setTimeout(() => {
                const allNums = Array.from({ length: 25 }, (_, i) => i + 1);
                const available = allNums.filter(n => !marked.includes(n));
                if (available.length > 0) {
                    const pick = available[Math.floor(Math.random() * available.length)];
                    playTurn(pick);
                    setHeaderText("Your Turn");
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, status, marked]);

    const endGame = (msg) => {
        setStatus('end');
        setHeaderText(msg);
    };

    return (
        <>
            <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', padding: '20px' }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>{headerText}</h2>

                    {status === 'setup' && (
                        <div className="setup-controls" style={{ marginBottom: '20px' }}>
                            <p style={{ marginBottom: '1rem', opacity: 0.8 }}>Numbers are randomized for you.</p>
                            <button onClick={randomizeGrid} className="btn-secondary" style={{ marginRight: '10px' }}> <FaUndo /> Shuffle</button>
                            <button onClick={startGame} className="btn-primary">Start Game</button>
                        </div>
                    )}

                    {status !== 'setup' && (
                        <div className="bingo-header" style={{ marginBottom: '10px' }}>
                            <h1 style={{ fontSize: '3rem', letterSpacing: '10px', color: 'var(--primary)', margin: 0, textShadow: '0 0 10px rgba(255,0,85,0.5)' }}>BINGO</h1>
                        </div>
                    )}

                    <div className="grid-container" style={{
                        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', margin: '0 auto', width: '100%', maxWidth: '400px', position: 'relative'
                    }}>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
                            {wonLines.map((lineIndex) => {
                                let x1, y1, x2, y2;
                                if (lineIndex < 5) { x1 = '0%'; x2 = '100%'; y1 = y2 = `${lineIndex * 20 + 10}%`; }
                                else if (lineIndex < 10) { x1 = x2 = `${(lineIndex - 5) * 20 + 10}%`; y1 = '0%'; y2 = '100%'; }
                                else if (lineIndex === 10) { x1 = '0%'; y1 = '0%'; x2 = '100%'; y2 = '100%'; }
                                else { x1 = '100%'; y1 = '0%'; x2 = '0%'; y2 = '100%'; }
                                return <line key={lineIndex} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 5px var(--primary))' }} />;
                            })}
                        </svg>
                        {grid.map((num, i) => {
                            const isMarked = marked.includes(num);
                            const isRobotTurn = turn === 'robot';
                            return (
                                <div key={i} onClick={() => handleCellClick(num)} className={`grid-cell ${isMarked ? 'marked' : ''}`}
                                    style={{
                                        aspectRatio: '1', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        background: isMarked ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '8px',
                                        cursor: (status === 'playing' && !isMarked && !isRobotTurn) ? 'pointer' : 'default',
                                        fontSize: '1.1rem', fontWeight: 'bold', color: isMarked ? 'white' : 'var(--secondary)',
                                        transition: 'transform 0.2s', boxShadow: isMarked ? '0 0 10px var(--primary)' : 'none',
                                        transform: isMarked ? 'scale(0.95)' : 'scale(1)'
                                    }}>
                                    {num || ''}
                                </div>
                            );
                        })}
                    </div>

                    {status !== 'setup' && (
                        <div className="game-info" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaUser /> You</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaRobot /> Robot</div>
                        </div>
                    )}
                </div>

                {status !== 'end' && (
                    <button onClick={() => window.location.href = '/'} className="btn-secondary" style={{ marginTop: '2rem', opacity: 0.6 }}>
                        Exit Game
                    </button>
                )}

                <footer style={{ marginTop: '1.5rem', padding: '1rem 0', width: '100%', textAlign: 'center', opacity: 0.6 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Ritesh & Sahil</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Made 🇮🇳 Bharat</p>
                </footer>
            </div>

            {status === 'end' && (
                <div className="result-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(15, 12, 41, 0.98)', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '15px', pointerEvents: 'auto'
                }}>
                    <div className="glass-panel" style={{
                        width: '95%', maxWidth: '600px', maxHeight: '95vh', overflowY: 'auto',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        boxShadow: '0 0 50px rgba(0,0,0,0.5)', border: '2px solid var(--primary)',
                        padding: '20px'
                    }}>
                        <h1 style={{ fontSize: '2.5rem', color: headerText.includes('You Won') ? '#00ff88' : '#ff0055', textAlign: 'center', textShadow: '0 0 20px currentColor', margin: '0.5rem 0' }}>
                            {headerText.includes('You Won') ? 'VICTORY!' : 'DEFEAT!'}
                        </h1>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '10px' }}>{headerText}</p>
                        <div style={{
                            display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', width: '100%',
                            margin: '1rem 0', justifyContent: 'center', alignItems: 'flex-start'
                        }}>
                            <div style={{ flex: '0 1 250px', width: '100%', textAlign: 'center' }}>
                                <p style={{ marginBottom: '8px', color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Final Board</p>
                                <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '5px' }}>
                                    {grid.map((num, i) => (
                                        <div key={i} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: marked.includes(num) ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.8rem', color: marked.includes(num) ? 'white' : '#777', border: marked.includes(num) ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent' }}>{num}</div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: '0 1 250px', width: '100%', textAlign: 'center' }}>
                                <p style={{ marginBottom: '8px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Robot's Final Board</p>
                                <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '5px' }}>
                                    {robotGrid.map((num, i) => (
                                        <div key={i} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: robotMarked.includes(num) ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.8rem', color: robotMarked.includes(num) ? 'white' : '#777', border: robotMarked.includes(num) ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent' }}>{num}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '1rem' }}>
                            <button className="btn-primary" style={{ flex: 1, padding: '15px', fontSize: '1rem' }} onClick={() => {
                                setMarked([]); setRobotMarked([]); setWonLines([]); setStatus('setup'); setHeaderText('Setup Your Board'); randomizeGrid();
                            }}>Play Again</button>
                            <button className="btn-secondary" style={{ flex: 1, padding: '15px', fontSize: '1rem' }} onClick={() => window.location.href = '/'}>Exit</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SinglePlayer;

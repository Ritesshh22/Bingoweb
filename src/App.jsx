import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import SinglePlayer from './components/SinglePlayer';
import Multiplayer from './components/Multiplayer';
import Rules from './components/Rules';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import './index.css';

import { useEffect } from 'react';
import sounds from './utils/SoundManager';

function App() {
    useEffect(() => {
        const unlock = () => {
            sounds.init();
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('click', unlock);
        window.addEventListener('touchstart', unlock);
        return () => {
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
        };
    }, []);

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/play" element={<SinglePlayer />} />
                    <Route path="/multiplayer" element={<Multiplayer />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

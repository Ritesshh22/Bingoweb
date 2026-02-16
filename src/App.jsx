import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import SinglePlayer from './components/SinglePlayer';
import Multiplayer from './components/Multiplayer';
import Rules from './components/Rules';
import './index.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/play" element={<SinglePlayer />} />
                    <Route path="/multiplayer" element={<Multiplayer />} />
                    <Route path="/rules" element={<Rules />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

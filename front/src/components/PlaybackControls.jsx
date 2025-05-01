import React, { useState } from 'react';
import './PlaybackControls.css';

import { useDJConsole } from '../DJConsoleContext';


const PlaybackControls = () => {
    const [activeButton, setActiveButton] = useState(null);
    const handleButtonPress = (button) => {
        setActiveButton(button);
    };
    const handleButtonRelease = () => {
        setActiveButton(null);
    };
    const { resetAllButtons } = useDJConsole();

    return (
        <div className="playback-controls">
            <button
                className={`play-button ${activeButton === 'play' ? 'pressed' : ''}`}
                onMouseDown={() => handleButtonPress('play')}
                onMouseUp={handleButtonRelease}
                onMouseLeave={handleButtonRelease}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points='5 1 21 12 5 23'></polygon>
                </svg>
            </button>
            <button 
                className={`pause-button ${activeButton === 'pause' ? 'pressed' : ''}`}
                onMouseDown={() => handleButtonPress('pause')}
                onMouseUp={handleButtonRelease}
                onMouseLeave={handleButtonRelease}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="2" width="4.5" height="19" rx={0.89}></rect>
                    <rect x="14" y="2" width="4.5" height="19" rx={0.89}></rect>
                </svg>
            </button>
            
            <button 
                className={`stop-button ${activeButton === 'stop' ? 'pressed' : ''}`}
                onMouseDown={() => handleButtonPress('stop')}
                onClick={resetAllButtons}
                onMouseUp={handleButtonRelease}
                onMouseLeave={handleButtonRelease}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="1" y="1" width="22" height="22" rx={1.77}></rect>
                </svg>
            </button>
        </div>
    );
};

export default PlaybackControls;
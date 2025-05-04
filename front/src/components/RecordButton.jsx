import React, { useState } from 'react';
import { useEffect } from 'react';
import './RecordButton.css';

import { useDJConsole } from '../DJConsoleContext';

const RecordButton = () => {
    const [activeButton, setActiveButton] = useState(null);
    const { resetTrigger } = useDJConsole();

    const handleClick = () => {
        const newState = !activeButton;
        setActiveButton(newState);

        if (newState) {
          console.log('ВКЛ');
        } else {
          console.log('ВЫКЛ');
        }
    };

    useEffect(() => {
    if (resetTrigger > 0) {
        setActiveButton(null);
    }
    }, [resetTrigger]);

    return (
        <div
            className={`record-button-container ${activeButton ? 'pressed' : ''}`}
            onClick={handleClick}
        >
            <div className="back-record-button"></div>
            <button className="record-button">
                Запись
            </button>
        </div>
    );
};

export default RecordButton;
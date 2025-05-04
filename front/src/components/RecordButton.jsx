import React from 'react';
import './RecordButton.css';


const RecordButton = ({ isRecording, onToggleRecording }) => {
    return (
        <div
            className={`record-button-container ${isRecording ? 'pressed' : ''}`}
            onClick={onToggleRecording}
        >
            <div className="back-record-button"></div>
            <button className="record-button">
                Запись
            </button>
        </div>
    );
};

export default RecordButton;
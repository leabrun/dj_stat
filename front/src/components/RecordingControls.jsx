import React from 'react';
import { useDJConsole } from '../DJConsoleContext';
import './RecordingControls.css';

const RecordingControls = () => {
  const { 
    isRecording, 
    startRecording, 
    stopRecording,
    recordedAudio,
    isPlaying,
    playRecording,
    pauseRecording,
    hasActiveSounds
  } = useDJConsole();

  return (
    <div className="recording-controls">
      <div className="record-section">
        <h3>Recording</h3>
        <div className="record-buttons">
          <button 
            className={`record-button ${isRecording ? 'active' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isPlaying}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          {!hasActiveSounds && !isRecording && (
            <div className="warning-message">
              No active sounds. Recording will be silent.
            </div>
          )}
          
          {isRecording && (
            <div className="recording-indicator">
              Recording in progress...
            </div>
          )}
        </div>
      </div>
      
      <div className="playback-section">
        <h3>Playback</h3>
        <div className="playback-buttons">
          <button 
            className="play-button"
            onClick={playRecording}
            disabled={!recordedAudio || isPlaying || isRecording}
          >
            Play
          </button>
          
          <button 
            className="pause-button"
            onClick={pauseRecording}
            disabled={!isPlaying}
          >
            Pause
          </button>
          
          {!recordedAudio && (
            <div className="info-message">
              No recording available. Record something first!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordingControls;
import React from 'react';
import './App.css';
import Cassette from './components/Cassette';
import MelodyButtonGroup from './components/MelodyButton';
import InstrumentButtonGroup from './components/InstrumentButton';
import RecordButton from './components/RecordButton';
import VolumeControl from './components/VolumeControl';
import PlaybackControls from './components/PlaybackControls';

import { useTelegramFullscreen } from './InitTelegram';
import useAudioManager from './AudioManager';


function App() {
  const {
    volume,
    updateVolume,
    activeSounds,
    isRecording,
    hasRecording,
    isPlaying,
    handleSoundToggle,
    handleToggleRecording,
    handlePlayPause,
    handleStopAll
  } = useAudioManager();
  
  useTelegramFullscreen();

  return (
      <div className="dj-station">
        <Cassette />

        <div className="lower-panel">
          <div className="music-buttons">
            <MelodyButtonGroup 
              onSoundToggle={handleSoundToggle} 
              activeSound={activeSounds['melodies']} 
            />

            <div className="sound-grid">
              <InstrumentButtonGroup
                onSoundToggle={handleSoundToggle} 
                activeSound={activeSounds['claps']} 
                type="clap"
              />
              <InstrumentButtonGroup
                onSoundToggle={handleSoundToggle} 
                activeSound={activeSounds['drums']} 
                type="drum"
              />
              <InstrumentButtonGroup
                onSoundToggle={handleSoundToggle} 
                activeSound={activeSounds['effs']} 
                type="eff"
              />
              <InstrumentButtonGroup
                onSoundToggle={handleSoundToggle} 
                activeSound={activeSounds['kicks']}
                type="kick"
              />
            </div>
          </div>

          <div className="music-tools">
            <RecordButton
              isRecording={isRecording} 
              onToggleRecording={handleToggleRecording} 
            />

            <VolumeControl
              volume={volume}
              updateVolume={updateVolume}
            />

            <PlaybackControls
              hasRecording={hasRecording} 
              isPlaying={isPlaying} 
              onPlayPause={handlePlayPause}
              onStop={handleStopAll}
            />
          </div>
        </div>
      </div>
  );
}

export default App;

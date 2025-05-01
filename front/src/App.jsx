import React from 'react';
import './App.css';
import Cassette from './components/Cassette';
import MelodyButtonGroup from './components/MelodyButton';
import InstrumentButtonGroup from './components/InstrumentButton';
import RecordButton from './components/RecordButton';
import VolumeControl from './components/VolumeControl';
import PlaybackControls from './components/PlaybackControls';
import RecordingControls from './components/RecordingControls';

import { useTelegramFullscreen } from './InitTelegram';
import { DJConsoleProvider } from './DJConsoleContext';


function App() {
  useTelegramFullscreen();

  return (
    <DJConsoleProvider>
      <div className="dj-station">
        <Cassette />

        <div className="lower-panel">
          <div className="music-buttons">
            {/* Melody buttons row */}
            <MelodyButtonGroup />
            
            {/* Sound buttons - each row represents a category */}
            <div className="sound-grid">
              {/* Audio wave buttons */}
              <InstrumentButtonGroup type="clap" />
              {/* <div className="button-row">
                <InstrumentButton type="wave" />
                <InstrumentButton type="wave" />
                <InstrumentButton type="wave" />
              </div> */}
              
              {/* Drum buttons */}
              <InstrumentButtonGroup type="drum" />
              {/* <div className="button-row">
                <InstrumentButton type="drum" />
                <InstrumentButton type="drum" />
                <InstrumentButton type="drum" />
              </div> */}
              
              {/* Star buttons */}
              <InstrumentButtonGroup type="eff" />
              {/* <div className="button-row">
                <InstrumentButton type="star" />
                <InstrumentButton type="star" />
                <InstrumentButton type="star" />
              </div> */}
              
              {/* Speaker buttons */}
              <InstrumentButtonGroup type="kick" />
              {/* <div className="button-row">
                <InstrumentButton type="speaker" />
                <InstrumentButton type="speaker" />
                <InstrumentButton type="speaker" />
              </div> */}
            </div>
          </div>

          <div className="music-tools">
            {/* Record button */}
            <RecordButton />
            
            {/* Volume slider */}
            <VolumeControl />
            
            {/* Playback controls */}
            <PlaybackControls />
            <RecordingControls />
          </div>
        </div>
      </div>
    </DJConsoleProvider>
  );
}

export default App;
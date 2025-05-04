import React from 'react';
import './App.css';
import Cassette from './components/Cassette';
import MelodyButtonGroup from './components/MelodyButton';
import InstrumentButtonGroup from './components/InstrumentButton';
import RecordButton from './components/RecordButton';
import VolumeControl from './components/VolumeControl';
import PlaybackControls from './components/PlaybackControls';

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
            <MelodyButtonGroup />

            <div className="sound-grid">
              <InstrumentButtonGroup type="clap" />
              <InstrumentButtonGroup type="drum" />
              <InstrumentButtonGroup type="eff" />
              <InstrumentButtonGroup type="kick" />
            </div>
          </div>

          <div className="music-tools">
            <RecordButton />

            <VolumeControl />

            <PlaybackControls />
          </div>
        </div>
      </div>
    </DJConsoleProvider>
  );
}

export default App;
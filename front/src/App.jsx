// import React from 'react';
// import './App.css';
// import Cassette from './components/Cassette';
// import MelodyButtonGroup from './components/MelodyButton';
// import InstrumentButtonGroup from './components/InstrumentButton';
// import RecordButton from './components/RecordButton';
// import VolumeControl from './components/VolumeControl';
// import PlaybackControls from './components/PlaybackControls';

// import { useTelegramFullscreen } from './InitTelegram';
// import { DJConsoleProvider } from './DJConsoleContext';


// function App() {
//   useTelegramFullscreen();

//   return (
//     <DJConsoleProvider>
//       <div className="dj-station">
//         <Cassette />

//         <div className="lower-panel">
//           <div className="music-buttons">
//             <MelodyButtonGroup />

//             <div className="sound-grid">
//               <InstrumentButtonGroup type="clap" />
//               <InstrumentButtonGroup type="drum" />
//               <InstrumentButtonGroup type="eff" />
//               <InstrumentButtonGroup type="kick" />
//             </div>
//           </div>

//           <div className="music-tools">
//             <RecordButton />

//             <VolumeControl />

//             <PlaybackControls />
//           </div>
//         </div>
//       </div>
//     </DJConsoleProvider>
//   );
// }

// export default App;



import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSounds, setActiveSounds] = useState({
    sound1: false,
    sound2: false,
    sound3: false
  });
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const destinationNodeRef = useRef(null);
  const soundSourcesRef = useRef({
    sound1: null,
    sound2: null,
    sound3: null
  });

  // Звуковые файлы (замените на свои пути)
  const soundFiles = {
    sound1: '/sounds/claps/1.wav',
    sound2: '/sounds/claps/2.wav',
    sound3: '/sounds/claps/3.wav'
  };

  // Инициализация аудиоконтекста
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Начать/остановить запись
  const toggleRecording = async () => {
    if (isRecording) {
      // Остановка записи
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (destinationNodeRef.current) {
        destinationNodeRef.current.disconnect();
      }
    } else {
      // Начало записи
      audioChunksRef.current = [];
      
      // Создаем MediaStreamDestination для записи
      destinationNodeRef.current = audioContextRef.current.createMediaStreamDestination();
      
      mediaRecorderRef.current = new MediaRecorder(destinationNodeRef.current.stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  // Включить/выключить циклическое воспроизведение звука
  const toggleSound = async (soundKey) => {
    if (activeSounds[soundKey]) {
      // Остановить воспроизведение
      if (soundSourcesRef.current[soundKey]) {
        soundSourcesRef.current[soundKey].stop();
        soundSourcesRef.current[soundKey] = null;
      }
      setActiveSounds(prev => ({ ...prev, [soundKey]: false }));
    } else {
      // Начать воспроизведение
      try {
        const response = await fetch(soundFiles[soundKey]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        
        const playLoop = () => {
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          
          // Подключаем к выходу и к ноде записи, если запись идет
          source.connect(audioContextRef.current.destination);
          if (isRecording && destinationNodeRef.current) {
            source.connect(destinationNodeRef.current);
          }
          
          source.start();
          source.onended = () => {
            if (activeSounds[soundKey]) {
              playLoop(); // Повторяем воспроизведение
            }
          };
          
          soundSourcesRef.current[soundKey] = source;
        };
        
        playLoop();
        setActiveSounds(prev => ({ ...prev, [soundKey]: true }));
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  // Воспроизвести запись
  const playRecording = () => {
    if (!audioURL) return;
    
    if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    setIsPlaying(true);
  };

  // Поставить на паузу
  const pauseRecording = () => {
    if (!isPlaying) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  // Остановить все звуки при размонтировании
  useEffect(() => {
    return () => {
      Object.keys(soundSourcesRef.current).forEach(key => {
        if (soundSourcesRef.current[key]) {
          soundSourcesRef.current[key].stop();
        }
      });
    };
  }, []);

  return (
    <div style={{ 
      fontFamily: 'Arial', 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>DJ Пульт с циклическими звуками</h1>
      
      {/* Кнопка записи */}
      <button
        onClick={toggleRecording}
        style={{
          background: isRecording ? '#ff4444' : '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          margin: '15px',
          fontWeight: 'bold'
        }}
      >
        {isRecording ? '⏹️ Стоп записи' : '● Начать запись'}
      </button>
      
      {/* Звуковые кнопки */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        margin: '25px 0'
      }}>
        {Object.keys(soundFiles).map((soundKey) => (
          <button
            key={soundKey}
            onClick={() => toggleSound(soundKey)}
            style={{
              background: activeSounds[soundKey] ? '#FF5722' : '#9C27B0',
              color: 'white',
              border: 'none',
              padding: '15px 10px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: activeSounds[soundKey] ? '0 0 15px rgba(255, 87, 34, 0.7)' : 'none'
            }}
          >
            {activeSounds[soundKey] ? '🔊 ' : '🔈 '}
            {soundKey.replace('sound', 'Звук ')}
          </button>
        ))}
      </div>
      
      {/* Кнопки управления воспроизведением записи */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        margin: '25px 0'
      }}>
        <button
          onClick={playRecording}
          disabled={!audioURL}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: !audioURL ? 0.5 : 1,
            minWidth: '180px'
          }}
        >
          ▶️ Воспроизвести запись
        </button>
        
        <button
          onClick={pauseRecording}
          disabled={!isPlaying}
          style={{
            background: '#FF9800',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: !isPlaying ? 0.5 : 1,
            minWidth: '180px'
          }}
        >
          ⏸️ Пауза
        </button>
      </div>
      
      {/* Аудио элемент (скрытый) */}
      <audio 
        ref={audioRef} 
        src={audioURL} 
        onEnded={() => setIsPlaying(false)}
        hidden
      />
      
      {/* Статус записи */}
      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        {audioURL && (
          <div>
            <h3 style={{ marginBottom: '10px' }}>Готовые записи</h3>
            <audio controls src={audioURL} style={{ width: '100%' }} />
          </div>
        )}
        {isRecording && (
          <p style={{ 
            color: 'red', 
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            ● Идет запись - активные звуки записываются
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
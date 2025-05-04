import { useState, useEffect, useRef, useCallback } from 'react';


// AudioManager component - handles all audio and recording logic
const useAudioManager = () => {
  const [activeSounds, setActiveSounds] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordedAudioUrlRef = useRef(null);
  const audioContextRef = useRef(null);
  const destinationRef = useRef(null);
  const sourceRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const updateVolume = (event, newValue) => {
    setVolume(newValue);
    if (audioRefs.current) {
      Object.keys(audioRefs.current).forEach(key => {
          audioRefs.current[key].volume = newValue / 100;
      });
    }
  };

  // Start the recording process
  const startRecording = useCallback(async () => {
    try {
      // Reset previous recording
      audioChunksRef.current = [];
      
      // Set up stream destination for recording
      destinationRef.current = audioContextRef.current.createMediaStreamDestination();
      
      // Create a new media recorder
      const mediaRecorder = new MediaRecorder(destinationRef.current.stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Handle data available event
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop event
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        recordedAudioUrlRef.current = audioUrl;
        setHasRecording(true);
        
        // Clean up destination
        destinationRef.current = null;
      };
      
      // Start recording
      mediaRecorder.start();
      
      // If any sounds are already active, connect them to the recorder
      Object.entries(audioRefs.current).forEach(([category, audio]) => {
        if (audio && activeSounds[category]) {
          if (sourceRefs.current[category]) {
            sourceRefs.current[category].disconnect();
          }
          const source = audioContextRef.current.createMediaElementSource(audio);
          source.connect(audioContextRef.current.destination); // To continue hearing the sound
          source.connect(destinationRef.current); // Connect to the recording destination
          sourceRefs.current[category] = source;
        }
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  }, [activeSounds]);

  // Store multiple audio elements for different categories
  const audioRefs = useRef({});
  const sourceRefs = useRef({});

  // Handle sound toggle
  const handleSoundToggle = useCallback((sound) => {
    const category = sound.category;
    const currentActive = activeSounds[category];
    
    if (currentActive?.id === sound.id) {
      // Turn off current sound from this category
      if (audioRefs.current[category]) {
        audioRefs.current[category].pause();
        delete audioRefs.current[category];
      }
      if (sourceRefs.current[category]) {
        sourceRefs.current[category].disconnect();
        delete sourceRefs.current[category];
      }
      
      setActiveSounds(prev => {
        const updated = {...prev};
        delete updated[category];
        return updated;
      });
    } else {
      // Turn off previous sound from this category if any
      if (audioRefs.current[category]) {
        audioRefs.current[category].pause();
      }
      if (sourceRefs.current[category]) {
        sourceRefs.current[category].disconnect();
      }
      
      // Start new sound
      const audio = new Audio(sound.url);
      audio.loop = true;
      
      // If we're currently recording, connect to the media recorder
      if (isRecording && audioContextRef.current && destinationRef.current) {
        const source = audioContextRef.current.createMediaElementSource(audio);
        source.connect(audioContextRef.current.destination); // To hear the sound
        
        // Connect to recording destination
        source.connect(destinationRef.current);
        
        sourceRefs.current[category] = source;
      }
      
      audio.play().catch(e => console.error("Audio playback error:", e));
      audioRefs.current[category] = audio;
      audioRefs.current[category].volume = volume / 100;
      
      setActiveSounds(prev => ({
        ...prev,
        [category]: sound
      }));
    }
  }, [activeSounds, isRecording, volume]);

  // Handle recording toggle
  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // Disconnect any existing source from the recording destination
      if (sourceRef.current && destinationRef.current) {
        sourceRef.current.disconnect(destinationRef.current);
      }
      
      setIsRecording(false);
    } else {
      // Resume or create audio context if needed (for browsers with autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Start recording
      startRecording();
      setIsRecording(true);
    }
  }, [isRecording, startRecording]);

  // Handle stop all sounds and recording
  const handleStopAll = useCallback(() => {
    // Stop all playing sounds
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
      }
    });
    
    // Disconnect all sources
    Object.values(sourceRefs.current).forEach(source => {
      if (source) {
        source.disconnect();
      }
    });
    
    // Reset refs
    audioRefs.current = {};
    sourceRefs.current = {};
    
    // Stop recording if active
    if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    // Stop playback if active
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
    
    // Clear active sounds
    setActiveSounds({});
  }, [isRecording, isPlaying]);

  // Handle playback control
  const handlePlayPause = useCallback((play) => {
    if (!hasRecording) return;
    
    if (play) {
      // Start playback
      handleStopAll();
      const audio = new Audio(recordedAudioUrlRef.current);
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(e => console.error("Playback error:", e));
      audioRef.current = audio;
      setIsPlaying(true);
    } else {
      // Pause playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [hasRecording, handleStopAll]);

  // Clean up audio on component unmount
  useEffect(() => {
    return () => {
      // Stop all sounds
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) audio.pause();
      });
      
      // Disconnect all sources
      Object.values(sourceRefs.current).forEach(source => {
        if (source) source.disconnect();
      });
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (recordedAudioUrlRef.current) {
        URL.revokeObjectURL(recordedAudioUrlRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
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
  };
};

export default useAudioManager;
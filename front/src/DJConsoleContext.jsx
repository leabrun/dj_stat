import React, { createContext, useState, useContext, useRef } from 'react';

// Create the context
const DJConsoleContext = createContext();

// Counter for reset events
let resetCounter = 0;

// Provider component
export const DJConsoleProvider = ({ children }) => {
  // State to trigger resets - incrementing this value triggers a reset
  const [resetTrigger, setResetTrigger] = useState(0);
  // Global volume state (0 to 1 for Audio API)
  const [volume, setVolume] = useState(0.5);
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs for recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingStreamRef = useRef(null);
  const audioPlayerRef = useRef(null);
  
  // Active sound tracks (for monitoring what's playing)
  const [activeSounds, setActiveSounds] = useState(new Set());
  
  // Function to register an active sound
  const registerSound = (soundId) => {
    setActiveSounds(prev => {
      const newSet = new Set(prev);
      newSet.add(soundId);
      return newSet;
    });
  };
  
  // Function to unregister an active sound
  const unregisterSound = (soundId) => {
    setActiveSounds(prev => {
      const newSet = new Set(prev);
      newSet.delete(soundId);
      return newSet;
    });
  };

  // Function to reset all buttons
  const resetAllButtons = () => {
    resetCounter++;
    setResetTrigger(resetCounter);
  };

  // Function to update the volume
  const updateVolume = (newValue) => {
    setVolume(newValue / 100);
  };
  
  // Function to start recording
  const startRecording = async () => {
    if (isRecording) return;
    
    try {
      // Check if there are active sounds
      if (activeSounds.size === 0) {
        alert("Warning: No active sounds. Recording will be silent.");
      }
      
      // Create audio stream from the current audio output
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = audioStream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Clear previous chunks
      audioChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Create a blob from the recorded chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Save the recording
        setRecordedAudio(audioUrl);
        
        // Clean up
        if (recordingStreamRef.current) {
          recordingStreamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not start recording. Please ensure microphone access is allowed.");
    }
  };
  
  // Function to stop recording
  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };
  
  // Function to play recorded audio
  const playRecording = () => {
    if (!recordedAudio || isPlaying) return;
    
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(recordedAudio);
      
      audioPlayerRef.current.onended = () => {
        setIsPlaying(false);
      };
    } else {
      audioPlayerRef.current.src = recordedAudio;
    }
    
    audioPlayerRef.current.volume = volume;
    audioPlayerRef.current.play().catch(err => console.error("Playback error:", err));
    setIsPlaying(true);
  };
  
  // Function to pause playback
  const pauseRecording = () => {
    if (!isPlaying || !audioPlayerRef.current) return;
    
    audioPlayerRef.current.pause();
    setIsPlaying(false);
  };

  // The context value
  const contextValue = {
    resetTrigger,
    resetAllButtons,
    volume,
    updateVolume,
    isRecording,
    startRecording,
    stopRecording,
    recordedAudio,
    isPlaying,
    playRecording,
    pauseRecording,
    registerSound,
    unregisterSound,
    hasActiveSounds: activeSounds.size > 0
  };

  return (
    <DJConsoleContext.Provider value={contextValue}>
      {children}
    </DJConsoleContext.Provider>
  );
};

// Custom hook to use the DJ console context
export const useDJConsole = () => {
  const context = useContext(DJConsoleContext);
  if (context === undefined) {
    throw new Error('useDJConsole must be used within a DJConsoleProvider');
  }
  return context;
};
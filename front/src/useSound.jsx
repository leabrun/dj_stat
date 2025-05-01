import { useRef, useEffect, useCallback } from 'react';
import { useDJConsole } from './DJConsoleContext';

const useSound = (soundUrl, soundId) => {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const playPromiseRef = useRef(null);
  
  // Get context values
  const { volume, registerSound, unregisterSound } = useDJConsole();

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
      audioRef.current.volume = volume;
    }

    // Cleanup on unmount
    return () => {
      stop();
      audioRef.current = null;
    };
  }, [soundUrl]);
  
  // Update volume when it changes in context
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            isPlayingRef.current = false;
            // Unregister sound when stopped
            unregisterSound(soundId);
          })
          .catch(() => {
            isPlayingRef.current = false;
            unregisterSound(soundId);
          });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlayingRef.current = false;
        // Unregister sound when stopped
        unregisterSound(soundId);
      }
    }
  }, [soundId, unregisterSound]);

  const play = useCallback(() => {
    if (!isPlayingRef.current && audioRef.current) {
      // Ensure the latest volume is set
      audioRef.current.volume = volume;
      
      // Store the play promise
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromiseRef.current = playPromise;
        
        playPromise
          .then(() => {
            isPlayingRef.current = true;
            // Register sound as active
            registerSound(soundId);
            
            if (playPromiseRef.current === playPromise) {
              playPromiseRef.current = null;
            }
          })
          .catch(err => {
            console.error("Audio play error:", err);
            isPlayingRef.current = false;
            if (playPromiseRef.current === playPromise) {
              playPromiseRef.current = null;
            }
          });
      } else {
        isPlayingRef.current = true;
        // Register sound as active
        registerSound(soundId);
      }
    }
  }, [volume, soundId, registerSound]);

  return { 
    play, 
    stop, 
    isPlaying: isPlayingRef.current 
  };
};

export default useSound;
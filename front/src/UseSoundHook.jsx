import { useRef, useEffect, useCallback } from 'react';
import { useDJConsole } from './DJConsoleContext';

const useSound = (soundUrl) => {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const playPromiseRef = useRef(null);
  
  const { volume } = useDJConsole();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
      audioRef.current.volume = volume;
    }

    return () => {
      stop();
      audioRef.current = null;
    };
  }, [soundUrl]);

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
          })
          .catch(() => {
            isPlayingRef.current = false;
          });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlayingRef.current = false;
      }
    }
  }, []);

  const play = useCallback(() => {
    if (!isPlayingRef.current && audioRef.current) {
      audioRef.current.volume = volume; 
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromiseRef.current = playPromise;
        
        playPromise
          .then(() => {
            isPlayingRef.current = true;
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
      }
    }
  }, [volume]); 

  return { 
    play, 
    stop, 
    isPlaying: isPlayingRef.current 
  };
};

export default useSound;
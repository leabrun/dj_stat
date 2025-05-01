import { useEffect } from 'react';
import { init, viewport, isTMA } from '@telegram-apps/sdk';

export function useTelegramFullscreen() {
    useEffect(() => {
        async function initTg() {
          if (await isTMA()) {
            init();
    
            if (viewport.mount.isAvailable()) {
              await viewport.mount();
              viewport.expand();
            }
    
            if (viewport.requestFullscreen.isAvailable()) {
              await viewport.requestFullscreen();
            }
          }
        }
        initTg();
    
      }, []);
    };
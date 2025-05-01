import React, { useState }  from 'react';
import { useEffect } from 'react';
import './MelodyButton.css';
import useSound from '../UseSoundHook';

import { useDJConsole } from '../DJConsoleContext';


const MelodyButtonGroup = () => {
    const [activeButton, setActiveButton] = useState(null);
    const { resetTrigger } = useDJConsole();

    useEffect(() => {
      if (resetTrigger > 0) {
        setActiveButton(null);
      }
    }, [resetTrigger]);

    const buttons = [
      { id: 'mldbtn1', url: '/sounds/melodies/4.wav' },
      { id: 'mldbtn2', url: '/sounds/melodies/5.wav' },
      { id: 'mldbtn3', url: '/sounds/melodies/6.wav' }
    ];
  
    const handleButtonClick = (buttonId) => {
      if (activeButton === buttonId) {
        setActiveButton(null);
      } else {
        setActiveButton(buttonId);
      }
    };

    return (
      <div className="melody-row">
        {buttons.map(button => (
          <MelodyButton
            key={button.id}
            soundUrl={button.url}
            isActive={activeButton === button.id}
            onClick={() => handleButtonClick(button.id)}
        />
    ))}
    </div>
  );
};


const MelodyButton = ({ key, isActive, soundUrl, onClick }) => {
  const pic = (
        <svg 
            width="12" 
            height="15" 
            viewBox="0 0 12 15" 
            fill="none"
        >
            <path 
                d="M6.55143 9.16416H3.43021C3.09863 9.16343 2.77042 9.23052 2.46587 9.36128C2.16132 9.49204 1.88691 9.68369 1.65958 9.92439C1.43225 10.1651 1.25685 10.4497 1.14421 10.7607C1.03157 11.0717 0.98408 11.4024 1.00469 11.7323C1.02529 12.0623 1.11356 12.3846 1.26402 12.6792C1.41447 12.9739 1.62394 13.2346 1.87945 13.4453C2.13497 13.656 2.43111 13.8123 2.74958 13.9043C3.06804 13.9964 3.40206 14.0224 3.73099 13.9807L4.1467 13.9286C4.8103 13.8456 5.42072 13.524 5.86345 13.0242C6.30619 12.5243 6.55081 11.8806 6.55143 11.2137V4.24496C6.55143 3.04009 6.55143 2.43803 6.90519 2.02202C7.25896 1.60601 7.85454 1.50629 9.04571 1.30758L10.8056 1.01511C10.9071 0.998738 10.9578 0.989807 10.9847 1.01958C11.0116 1.04934 10.9996 1.09846 10.975 1.19818L10.307 3.86318C10.2958 3.90784 10.2899 3.93016 10.2742 3.94505C10.2585 3.95993 10.2369 3.9644 10.1914 3.97333L6.55143 4.69893"
                stroke="#0000FF"
                strokeWidth="2"
            />
        </svg>
    )
  
  const { play, stop } = useSound(soundUrl, {loop: true});
  
  useEffect(() => {
          if (isActive) {
          play();
          } else {
          stop();
          }
    }, [isActive, play, stop]);

    return (
        <div 
            className={`custom-melody-button ${isActive ? 'pressed' : ''}`}
            onClick={onClick}
        >
            <div className="back-melody-button"></div>
            <button className='melody-button'>            
                {pic}
                <span className='melody-text'>Мелодия</span>        
            </button>
        </div>
    );
};

export default MelodyButtonGroup;
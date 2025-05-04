import React, { createContext, useState, useContext  } from 'react';

const DJConsoleContext = createContext();

let resetCounter = 0;

export const DJConsoleProvider = ({ children }) => {
  const [resetTrigger, setResetTrigger] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  const resetAllButtons = () => {
    resetCounter++;
    setResetTrigger(resetCounter);
    updateVolume(50);
  };

  const updateVolume = (newValue) => {
    setVolume(newValue / 100);
  };

  const contextValue = {
    resetTrigger,
    resetAllButtons,
    volume,
    updateVolume
  };

  return (
    <DJConsoleContext.Provider value={contextValue}>
      {children}
    </DJConsoleContext.Provider>
  );
};

export const useDJConsole = () => {
  const context = useContext(DJConsoleContext);
  if (context === undefined) {
    throw new Error('useDJConsole must be used within a DJConsoleProvider');
  }
  return context;
};
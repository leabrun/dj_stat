import React from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { useDJConsole } from '../DJConsoleContext';
import './VolumeControl.css';

const VolumeControl = () => {
  // Use the DJ console context
  const { volume, updateVolume } = useDJConsole();
  // Convert volume from 0-1 scale to 1-100 scale for the slider
  const sliderValue = volume * 100;

    const CustomSlider = styled(Slider)({
        marginRight: '17px',
        color: '#000',
        height: 3,
        '& .MuiSlider-track': {
          height: 3,
          borderRadius: 4.5,
        },
        '& .MuiSlider-rail': {
          height: 3,
          borderRadius: 4.5,
          backgroundColor: '#939393',
        },
        '& .MuiSlider-thumb': {
          width: 16,
          height: 16,
          backgroundColor: '#000',
          '&:hover, &.Mui-focusVisible': {
            boxShadow: 'none',
          },
          '&.Mui-active': {
            boxShadow: 'none',
          },
        },
      });
    
    const handleVolumeChange = (event, newValue) => {
      updateVolume(newValue);
    };

    return (
        <div className="volume-container">
            <CustomSlider
                value={sliderValue}
                onChange={handleVolumeChange}
                min={1}
                max={100}
                aria-label="Volume slider"
            />
            <div className="volume-icon">
                <svg width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.58333 18.7533H6.06696L13.4915 23.8866C13.6862 24.0207 13.9123 24.0977 14.1458 24.1095C14.3794 24.1213 14.6116 24.0674 14.818 23.9535C15.0242 23.8391 15.1965 23.6687 15.3166 23.4606C15.4367 23.2525 15.5001 23.0145 15.5 22.772V1.33888C15.4999 1.09657 15.4364 0.858836 15.3163 0.650991C15.1962 0.443147 15.024 0.272978 14.818 0.158608C14.612 0.0442388 14.38 -0.0100478 14.1466 0.00153042C13.9132 0.0131086 13.6873 0.0901178 13.4927 0.224356L6.06696 5.35759H2.58333C1.15862 5.35759 0 6.55919 0 8.03674V16.0742C0 17.5517 1.15862 18.7533 2.58333 18.7533ZM2.58333 8.03674H6.45833C6.50096 8.03674 6.53712 8.01531 6.57846 8.01129C6.74982 7.99295 6.9161 7.94017 7.068 7.8559C7.10158 7.83714 7.14162 7.83312 7.17392 7.81169L12.9167 3.8412V20.2697L7.17521 16.2992C7.14292 16.2751 7.10287 16.2724 7.06929 16.255C6.91689 16.1685 6.74891 16.1156 6.57587 16.0996C6.53454 16.0956 6.49967 16.0742 6.45833 16.0742H2.58333V8.03674Z" fill="black"/>
                    <path d="M21.9583 19.375V4.73611" stroke="black" stroke-width="1.77"/>
                    <line y1="-0.885" x2="7.75" y2="-0.885" transform="matrix(0 -1 -1 0 18.0833 15.9307)" stroke="black" stroke-width="1.77"/>
                </svg>
            </div>
        </div>
    );
};

export default VolumeControl;
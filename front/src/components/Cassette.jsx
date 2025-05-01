import React from 'react';
import './Cassette.css';

const Cassette = () => {
    const lines = Array.from({ length: 22 }, (_, i) => (
        <div 
          key={i} 
          className="hatch-line" 
          style={{ marginBottom: 8 }} 
        />
      ));
    
    const gear = (
        <div className="gear">
            <svg width="48" height="49" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M47.8193 21.8859H42.0171V27.9092H47.8204C46.9995 34.4935 43.518 40.2516 38.4856 44.0737L35.5879 39.0547L30.3716 42.0663L33.271 47.0882C30.4036 48.2947 27.2532 48.9615 23.9472 48.9615C20.6363 48.9615 17.4816 48.2927 14.6109 47.0829L17.5146 42.0536L12.2983 39.042L9.39792 44.0655C4.37139 40.2434 0.894252 34.4888 0.073897 27.9092H5.87725V21.8859H0.0750484C0.898137 15.3051 4.37912 9.55026 9.40958 5.72994L12.3075 10.7493L17.5238 7.73769L14.6244 2.71572C17.4915 1.50949 20.6415 0.842815 23.9472 0.842815C27.2565 0.842815 30.4099 1.51098 33.2796 2.71977L30.38 7.74203L35.5963 10.7537L38.4931 5.73626C43.519 9.55661 46.9966 15.3087 47.8193 21.8859Z" fill="black"/>
            </svg>
        </div>
    );
    
    return (
        <div className="top-panel">
            <div className="lower-border"></div>
            <div className="cassette-container">
                <div className="cassette">
                    <div className="lines">
                        {lines}
                    </div>
                    <div className="cassette-middle">
                        <div className="tape-controls">
                            <div className="pencil-thingy">
                                {gear}
                            </div>
                            <div className="window">
                                <div className="label-window"></div>
                            </div>
                            <div className="pencil-thingy">
                                {gear}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cassette;
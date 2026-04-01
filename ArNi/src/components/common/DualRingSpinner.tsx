import React from 'react';

const DualRingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-16 h-16">
        {/* First Ring */}
        <div className="absolute w-full h-full border-4 border-solid border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Second Ring (Delayed or offset to create the dual effect) */}
        <div 
          className="absolute w-full h-full border-4 border-solid border-blue-200 border-t-blue-500 rounded-full animate-spin"
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        ></div>
      </div>
    </div>
  );
};

export default DualRingSpinner;
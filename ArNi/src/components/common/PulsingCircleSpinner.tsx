import React from 'react';

const PulsingCircleSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div 
        className="w-12 h-12 border-4 border-blue-500 border-solid rounded-full animate-pulse" 
        aria-label="loading"
      />
    </div>
  );
};

export default PulsingCircleSpinner;
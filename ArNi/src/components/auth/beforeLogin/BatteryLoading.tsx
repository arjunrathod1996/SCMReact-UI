import React from 'react';

const BatteryLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col items-center">
        
        {/* Battery Container */}
        <div className="relative w-28 h-16 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl border border-gray-300 shadow-lg shadow-blue-500/50">
          {/* Battery Tip */}
          <div className="absolute top-1/4 -right-2 w-3 h-8 bg-gray-400 rounded-r-md border border-gray-300"></div>
        </div>

        {/* Battery Level / Animation Wrapper */}
        <div className="absolute top-2 left-2 flex items-center justify-start w-24 h-12 rounded-lg overflow-hidden">
          {/* Note: 'animate-slide-bar' must be defined in your tailwind.config.js 
            or your global CSS file for the animation to work.
          */}
          <div className="h-full bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 animate-slide-bar"></div>
        </div>

        {/* Loading Text */}
        <p className="mt-6 text-xl font-semibold text-gray-800 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default BatteryLoading;
import React from 'react';

const BouncingDotsSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Dot 1 */}
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      
      {/* Dot 2 - Staggered using inline style since tailwind doesn't have animation-delay by default */}
      <div 
        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
        style={{ animationDelay: '0.2s' }}
      ></div>
      
      {/* Dot 3 */}
      <div 
        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
        style={{ animationDelay: '0.4s' }}
      ></div>
    </div>
  );
};

export default BouncingDotsSpinner;
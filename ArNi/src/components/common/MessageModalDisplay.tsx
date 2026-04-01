import React, { useEffect } from "react";

// 1. Define the Prop Types
interface MessageDisplayProps {
  message: string | null | undefined;
  type: "success" | "error";
  clearMessage: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ 
  message, 
  type, 
  clearMessage 
}) => {
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000); // Show message for 3 seconds
      
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [message, clearMessage]);

  // 2. Return null if there's no message to show
  if (!message) return null;

  // 3. Define styles using a Record for strict key checking
  const messageStyles: Record<"success" | "error", string> = {
    success: "text-green-700 bg-green-100 border-green-300",
    error: "text-red-700 bg-red-100 border-red-300"
  };

  // Fallback to error if type is somehow incorrect (though TS prevents this)
  const currentStyle = messageStyles[type] || messageStyles.error;

  return (
    <div 
      role="alert" 
      className={`p-4 text-sm ${currentStyle} border rounded-md transition-opacity duration-300`}
    >
      {message}
    </div>
  );
};

export default MessageDisplay;
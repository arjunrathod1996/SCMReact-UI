import React, { useEffect } from "react";

// 1. Define the interface for the props
interface MessageDisplayProps {
  message: string | null | undefined;
  type?: "success" | "error"; 
  clearMessage?: () => void;  
}

const MessageDisplay_: React.FC<MessageDisplayProps> = ({ 
  message, 
  type = "error", 
  clearMessage 
}) => {
  
  // 2. Automatically clear the message after 3 seconds
  useEffect(() => {
    if (message && clearMessage) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  // 3. Conditional rendering
  if (!message) return null;

  // 4. Map styles based on the 'type' prop
  const messageStyles: Record<"success" | "error", string> = {
    success: "text-green-700 bg-green-100 border-green-300",
    error: "text-red-700 bg-red-100 border-red-300",
  };

  return (
    <div 
      role="alert"
      className={`p-4 mt-8 text-sm ${messageStyles[type]} border rounded-md transition-all duration-300`}
    >
      {message}
    </div>
  );
};

export default MessageDisplay_;
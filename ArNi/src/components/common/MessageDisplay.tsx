import React from "react";

// 1. Define the interface for the props
interface MessageDisplayProps {
  message?: string | null;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => (
  message ? (
    <div className="mt-4 p-4 bg-red-100 text-red-800 static rounded-md border border-red-300">
      {message}
    </div>
  ) : null
);

export default MessageDisplay;
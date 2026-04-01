import React from "react";

interface ActionButtonProps {
  children?: React.ReactNode;
  className?: string;
  buttonStyle?: string;
  isDisabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  className,
  buttonStyle,
  isDisabled,
  onClick,
  type = "button", // Default button type is "button"
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${className} ${buttonStyle} text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800`}
    >
      {children}
    </button>
  );
};

export default ActionButton;

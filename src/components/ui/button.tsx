// src/components/ui/button.tsx
import React from "react";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline" | "destructive";
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className = "",
  variant = "default",
  children,
  disabled,
}) => {
  const baseStyles = "px-4 py-2 rounded transition duration-200";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline:
      "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

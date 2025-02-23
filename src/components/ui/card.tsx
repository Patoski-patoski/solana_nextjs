// src/components/ui/card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      style={{ backgroundColor: "#512da8" }}
      className={`grid shadow-md rounded-lg p-4 ${className}`}
    >
      {children}
    </div>
  );
};


export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`border-b mb-2 pb-2 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ children, className }) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
};

export default Card;

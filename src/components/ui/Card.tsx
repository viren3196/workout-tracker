import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  elevated?: boolean;
}

export function Card({ children, className = '', onClick, elevated }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border border-slate-800
        ${elevated ? 'bg-[#222240]' : 'bg-[#1a1a2e]'}
        ${onClick ? 'cursor-pointer hover:bg-[#222240] active:bg-[#2a2a50] transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

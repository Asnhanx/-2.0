import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading,
  ...props 
}) => {
  const baseStyles = "rounded-2xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-sm border border-transparent";
  
  const variants = {
    // Primary: Amber/Yellow -> Darker Amber
    primary: "bg-[#FCD34D] text-[#78350F] hover:bg-[#F59E0B] shadow-amber-200/50",
    // Secondary: White with Amber border
    secondary: "bg-white text-gray-600 border-amber-200 hover:bg-amber-50",
    // Danger: Soft Red
    danger: "bg-red-100 text-red-600 hover:bg-red-200",
    // Ghost: Transparent
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 shadow-none"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <i className="fas fa-spinner fa-spin"></i>}
      {children}
    </button>
  );
};
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
  target?: string;
  className?: string;
}

export default function Button({ 
  label, 
  onClick, 
  variant = "primary", 
  size = "md",
  disabled = false,
  icon,
  type = "button",
  loading = false,
  fullWidth = false,
  href,
  target,
  className = ""
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-primary-600 text-white shadow-soft transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:scale-105 hover:shadow-2xl focus:ring-primary-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-primary-500 shadow-soft hover:shadow-medium",
    success: "bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-soft hover:shadow-medium",
    warning: "bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-soft hover:shadow-medium",
    danger: "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-soft hover:shadow-medium",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-primary-500",
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  const content = (
    <>
      {loading && <span>Loading...</span>}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      <span>{label}</span>
    </>
  );

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {content}
    </button>
  );
}

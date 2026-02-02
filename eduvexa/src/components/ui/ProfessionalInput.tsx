import React from 'react';

interface ProfessionalInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export default function ProfessionalInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  required = false,
  className = '',
  icon,
  helperText,
}: ProfessionalInputProps) {
  const inputId = React.useId();

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm
            ${icon ? 'pl-10' : 'pl-3'}
            bg-surface-0 border border-neutral-200 rounded-lg
            text-neutral-900 placeholder-neutral-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-neutral-50 disabled:text-neutral-500
            transition-colors duration-250
            ${error ? 'border-error-500 focus:ring-error-500' : ''}
          `}
        />
      </div>
      
      {error && (
        <p className="text-sm text-error-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

interface ProfessionalDropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'borderless';
}

export default function ProfessionalDropdown({
  options,
  placeholder = 'Select option',
  value,
  onChange,
  className = '',
  disabled = false,
  size = 'md',
  variant = 'default',
}: ProfessionalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const variantStyles = {
    default: 'bg-surface-0 border border-neutral-200',
    borderless: 'bg-transparent border-transparent',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option: DropdownOption) => {
    if (!option.disabled) {
      onChange?.(option.value);
      option.onClick?.();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-3
          ${variantStyles[variant]} 
          ${sizeStyles[size]}
          rounded-lg text-neutral-900 placeholder-neutral-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-neutral-50 disabled:text-neutral-500
          transition-colors duration-250
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className={selectedOption ? 'text-neutral-900' : 'text-neutral-400'}>
            {displayValue}
          </span>
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-neutral-400 transition-transform duration-250 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-surface-0 border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option)}
              disabled={option.disabled}
              className={`
                w-full flex items-center gap-3 px-4 py-2 text-sm text-left
                ${option.disabled 
                  ? 'text-neutral-400 cursor-not-allowed' 
                  : 'text-neutral-700 hover:bg-neutral-50 cursor-pointer'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                transition-colors duration-150
              `}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

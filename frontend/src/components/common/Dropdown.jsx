// components/common/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({
  options = [],
  value = '',
  placeholder = 'Select an option',
  onChange,
  name,
  isDisabled = false,
  className = '',
  menuWidth = 'auto',
  error = '',
  required = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Find selected option label
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleOptionClick = (option) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: option.value
        }
      };
      
      onChange(syntheticEvent);
    }
    
    setIsOpen(false);
  };
  
  const toggleDropdown = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };
  
  const getMenuStyles = () => {
    if (menuWidth === 'auto') return {};
    return { width: menuWidth };
  };
  
  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}
      {...props}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className={`
          relative w-full bg-white border rounded-md shadow-sm pl-3 pr-10 py-2 text-left 
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
        disabled={isDisabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
          {displayValue}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-10 mt-1 rounded-md bg-white shadow-lg max-h-60 overflow-auto focus:outline-none ring-1 ring-black ring-opacity-5"
          style={getMenuStyles()}
        >
          <ul
            className="py-1"
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-option-0"
          >
            {options.map((option, index) => (
              <li
                key={index}
                className={`
                  cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm
                  ${option.value === value ? 'text-white bg-blue-600' : 'text-gray-900 hover:bg-gray-100'}
                `}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleOptionClick(option)}
              >
                <span className={`block truncate ${option.value === value ? 'font-semibold' : 'font-normal'}`}>
                  {option.label}
                </span>
                
                {option.value === value && (
                  <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${option.value === value ? 'text-white' : 'text-blue-600'}`}>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {name && (
        <input
          type="hidden"
          name={name}
          value={value || ''}
          required={required}
        />
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  menuWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  required: PropTypes.bool
};

export default Dropdown;
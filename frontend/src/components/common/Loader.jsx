import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ size = 'medium', color = 'primary', fullScreen = false, text = 'Loading...' }) => {
  // Determine sizing based on the size prop
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Determine color based on the color prop
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-cyan-600'
  };

  const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]} animate-spin`;

  const loaderContent = (
    <div className="flex flex-col items-center justify-center">
      <svg 
        className={spinnerClass} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <p className="mt-2 text-sm font-medium text-gray-700">{text}</p>}
    </div>
  );

  // Handle fullScreen display if needed
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  fullScreen: PropTypes.bool,
  text: PropTypes.string
};

export default Loader;
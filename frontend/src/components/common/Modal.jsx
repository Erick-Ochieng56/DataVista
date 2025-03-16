import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnEsc = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  preventBackgroundScroll = true
}) => {
  const modalRef = useRef(null);
  
  // Sizes for the modal window
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Prevent background scrolling when modal is open
    if (isOpen && preventBackgroundScroll) {
      document.body.style.overflow = 'hidden';
    }

    document.addEventListener('keydown', handleEscKey);
    
    // Cleanup event listener and restore scrolling
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      if (preventBackgroundScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClose, closeOnEsc, preventBackgroundScroll]);

  // Handle clicks outside the modal
  const handleOutsideClick = (event) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl mx-auto ${sizeClasses[size]} w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 id="modal-title" className="text-lg font-medium text-gray-900">
            {title}
          </h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              aria-label="Close"
            >
              <svg 
                className="h-5 w-5" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          )}
        </div>
        
        {/* Modal Content */}
        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
        
        {/* Modal Footer */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-end space-x-3">
            {footer}
          </div>
        )}
        
        {/* Default Footer if no custom footer is provided */}
        {!footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onClose}>
              Confirm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'full']),
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  preventBackgroundScroll: PropTypes.bool
};

export default Modal;
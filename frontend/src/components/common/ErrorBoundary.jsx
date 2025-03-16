import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo
    });
    
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }
  
  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      
      // Default fallback UI
      return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="mb-4">
            <svg 
              className="mx-auto h-12 w-12 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {this.props.message || "An error occurred while rendering this component."}
          </p>
          {this.props.showDetails && (
            <div className="mb-6 text-left bg-gray-50 p-4 rounded overflow-auto max-h-40">
              <p className="font-mono text-sm text-red-600">
                {this.state.error && this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <pre className="mt-2 font-mono text-xs text-gray-700 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
          <div className="flex justify-center space-x-3">
            <Button 
              onClick={this.handleReset}
              variant="primary"
            >
              Try Again
            </Button>
            {this.props.showReportButton && (
              <Button
                onClick={() => this.props.onReport && this.props.onReport(this.state.error, this.state.errorInfo)}
                variant="outline"
              >
                Report Issue
              </Button>
            )}
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func,
  onReport: PropTypes.func,
  message: PropTypes.string,
  showDetails: PropTypes.bool,
  showReportButton: PropTypes.bool
};

ErrorBoundary.defaultProps = {
  showDetails: process.env.NODE_ENV === 'development',
  showReportButton: false
};

export default ErrorBoundary;
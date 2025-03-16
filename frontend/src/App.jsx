// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CrimeDataProvider } from './context/CrimeDataProvider';
// import ErrorBoundary from './components/common/ErrorBoundary';

// Import global styles
import './index.css';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CrimeDataProvider>
            <RouterProvider router={router} />
          </CrimeDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
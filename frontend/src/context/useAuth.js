// src/hooks/useAuth.js
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Use named export instead of default export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
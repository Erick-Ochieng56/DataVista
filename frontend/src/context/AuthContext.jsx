import React, { useState, useEffect } from 'react';
import { authService, api } from '../services/api';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define validateToken inside useEffect to avoid dependency issues
  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('authToken');
    
    const validateToken = async (token) => {
      try {
        // Implement token validation endpoint on backend
        const response = await api.post('/accounts/validate-token/', { token });
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch {
        // Clear invalid tokens
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      // Validate token with backend
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('authToken', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
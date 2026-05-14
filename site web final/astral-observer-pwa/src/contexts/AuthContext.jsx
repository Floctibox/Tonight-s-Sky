import React, { createContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (on mount)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProfile();
      setUser(response.user);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      // Token might be expired or invalid
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setError('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, username) => {
    try {
      setError(null);
      const response = await apiClient.register(email, password, username);
      apiClient.setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await apiClient.login(email, password);
      apiClient.setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      setError(null);
      const response = await apiClient.updateProfile(updates);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    loadUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

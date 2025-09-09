import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../features/auth/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      console.log('AuthContext: User and token loaded from localStorage:', storedUser); // DEBUG LOG
    } else {
      console.log('AuthContext: No user or token found in localStorage on mount.'); // DEBUG LOG
    }
  }, []);

  const register = async (userData) => {
    setIsLoading(true);
    setIsError(false);
    setMessage('');
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setToken(data.token);
      setMessage(data.message || 'Registration successful!');
      setIsLoading(false);
      console.log('AuthContext: Registration successful, user set:', data.user); // DEBUG LOG
      return data;
    } catch (error) {
      const errorMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setIsError(true);
      setMessage(errorMessage);
      setUser(null);
      setToken(null);
      setIsLoading(false);
      console.error('AuthContext: Registration failed:', errorMessage); // DEBUG LOG
      throw error;
    }
  };

  const login = async (userData) => {
    setIsLoading(true);
    setIsError(false);
    setMessage('');
    try {
      const data = await authService.login(userData);
      setUser(data.user);
      setToken(data.token);
      setMessage(data.message || 'Login successful!');
      setIsLoading(false);
      console.log('AuthContext: Login successful, user set:', data.user); // DEBUG LOG
      return data;
    } catch (error) {
      const errorMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      setIsError(true);
      setMessage(errorMessage);
      setUser(null);
      setToken(null);
      setIsLoading(false);
      console.error('AuthContext: Login failed:', errorMessage); // DEBUG LOG
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsError(false);
    setMessage('Logged out successfully!');
    console.log('AuthContext: User logged out.'); // DEBUG LOG
  };

  const resetAuthStatus = () => {
    setIsError(false);
    setMessage('');
    console.log('AuthContext: Auth status reset.'); // DEBUG LOG
  };

  const authContextValue = {
    user,
    token,
    isLoading,
    isError,
    message,
    register,
    login,
    logout,
    resetAuthStatus,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

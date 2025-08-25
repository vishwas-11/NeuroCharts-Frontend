// // src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import authService from '../features/auth/authService'; // Still use the service for API calls

// // Create the AuthContext
// const AuthContext = createContext(null);

// // Custom hook to use the AuthContext
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// // AuthProvider component to wrap your application
// export const AuthProvider = ({ children }) => {
//   // State to hold user data and token
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   // State for loading, error, and message feedback
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [message, setMessage] = useState('');

//   // Effect to load user and token from localStorage on initial render
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     const storedToken = localStorage.getItem('token');
//     if (storedUser && storedToken) {
//       setUser(storedUser);
//       setToken(storedToken);
//     }
//   }, []); // Empty dependency array means this runs only once on mount

//   // Function to handle user registration
//   const register = async (userData) => {
//     setIsLoading(true);
//     setIsError(false);
//     setMessage('');
//     try {
//       const data = await authService.register(userData); // Call the service
//       setUser(data.user);
//       setToken(data.token);
//       setMessage(data.message || 'Registration successful!');
//       setIsLoading(false);
//       return data; // Return data for component to use (e.g., navigation)
//     } catch (error) {
//       const errorMessage =
//         (error.response && error.response.data && error.response.data.message) ||
//         error.message ||
//         error.toString();
//       setIsError(true);
//       setMessage(errorMessage);
//       setUser(null);
//       setToken(null);
//       setIsLoading(false);
//       throw error; // Re-throw to allow components to catch specific errors
//     }
//   };

//   // Function to handle user login
//   const login = async (userData) => {
//     setIsLoading(true);
//     setIsError(false);
//     setMessage('');
//     try {
//       const data = await authService.login(userData); // Call the service
//       setUser(data.user);
//       setToken(data.token);
//       setMessage(data.message || 'Login successful!');
//       setIsLoading(false);
//       return data;
//     } catch (error) {
//       const errorMessage =
//         (error.response && error.response.data && error.response.data.message) ||
//         error.message ||
//         error.toString();
//       setIsError(true);
//       setMessage(errorMessage);
//       setUser(null);
//       setToken(null);
//       setIsLoading(false);
//       throw error;
//     }
//   };

//   // Function to handle user logout
//   const logout = () => {
//     authService.logout(); // Clear localStorage via service
//     setUser(null);
//     setToken(null);
//     setIsError(false);
//     setMessage('Logged out successfully!');
//   };

//   // Function to reset error/message states (useful after displaying feedback)
//   const resetAuthStatus = () => {
//     setIsError(false);
//     setMessage('');
//   };

//   // The value that will be provided to consumers of this context
//   const authContextValue = {
//     user,
//     token,
//     isLoading,
//     isError,
//     message,
//     register,
//     login,
//     logout,
//     resetAuthStatus,
//   };

//   return (
//     <AuthContext.Provider value={authContextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// /*
//   Explanation for src/context/AuthContext.jsx:
//   - `createContext`: Creates the context object.
//   - `useAuth`: A custom hook that simplifies consuming the context.
//   - `AuthProvider`:
//     - Manages `user`, `token`, `isLoading`, `isError`, `message` states using `useState`.
//     - `useEffect`: Loads initial `user` and `token` from `localStorage` when the component mounts.
//     - `register`, `login`, `logout`: Asynchronous functions that call `authService` for API interactions and update the local state based on the response. They also handle error messages.
//     - `resetAuthStatus`: A utility to clear error/message states.
//     - `AuthContext.Provider`: Makes the `authContextValue` available to all components wrapped by `AuthProvider`.
// */






// src/context/AuthContext.jsx
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

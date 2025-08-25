// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

function PrivateRoute({ children }) {
  // Get user from the AuthContext
  const { user } = useAuth();

  // If user exists, render the children (the protected component)
  // Otherwise, redirect to the login page
  if (user) {
    return children;
  }

  // Use Navigate component for declarative redirection
  return <Navigate to="/login" replace />;
}

export default PrivateRoute;

/*
  Explanation for src/components/PrivateRoute.jsx:
  - `useAuth`: Custom hook to access the authentication context.
  - Checks for the existence of `user` in the context. If `user` is null, it means no one is authenticated.
  - `Navigate`: Performs a declarative navigation to the login page.
*/

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


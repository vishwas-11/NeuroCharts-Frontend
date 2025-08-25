// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Import your Tailwind CSS
import { AuthProvider } from './context/AuthContext'; // Import the new AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the entire application with AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);

/*
  Explanation for src/main.jsx:
  - `ReactDOM.createRoot(...).render()`: The standard way to render a React application.
  - `React.StrictMode`: A tool for highlighting potential problems.
  - `./index.css`: Imports your global Tailwind CSS styles.
  - `AuthProvider`: This is the context provider that will manage and provide authentication state and functions to all its children components.
  - `<App />`: Your main application component.
*/

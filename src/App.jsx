import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './landing/LandingPage';

// Import your existing components
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import ViewFile from './components/ViewFile';
import AdminPanel from './components/AdminPanel';
import ChartStudio from './components/ChartStudio'; // NEW: Import ChartStudio

// Import the global components from the landing page
import { CustomCursor, ThreeDBackground } from './landing/LandingPage';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="bg-gradient-to-br from-gray-900 to-black text-gray-100 font-inter min-h-screen">
        <CustomCursor />
        <ThreeDBackground />
        
        <Navbar />

        <main>
          <Routes>
            <Route
              path="/"
              element={user ? <Dashboard /> : <LandingPage />}
            />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/:id"
              element={
                <PrivateRoute>
                  <ViewFile />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-panel"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            {/* NEW: Charting Route */}
            <Route
              path="/chart-studio"
              element={
                <PrivateRoute>
                  <ChartStudio />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;






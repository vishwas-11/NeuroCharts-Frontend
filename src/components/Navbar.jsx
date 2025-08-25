// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// function Navbar() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const onLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-gray-900 p-4 shadow-lg border-b border-gray-700"> {/* Darker background, subtle border */}
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to={user ? "/dashboard" : "/"} className="text-white text-2xl font-bold rounded-md px-3 py-2 hover:bg-gray-800 transition duration-200">
//           Excel Analytics
//         </Link>
//         <div className="flex space-x-4">
//           {user ? (
//             <>
//               <span className="text-gray-200 text-lg font-medium py-2 px-3"> {/* Lighter gray for welcome text */}
//                 Welcome, {user.username}!
//               </span>
//               <button
//                 onClick={onLogout}
//                 className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200 shadow-md"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="text-gray-200 font-medium py-2 px-3 rounded-lg hover:bg-gray-800 transition duration-200">
//                 Login
//               </Link>
//               <Link to="/register" className="text-gray-200 font-medium py-2 px-3 rounded-lg hover:bg-gray-800 transition duration-200">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

// /*
//   Explanation for src/components/Navbar.jsx:
//   - `bg-gray-900`: Very dark background for the navbar.
//   - `border-b border-gray-700`: A subtle bottom border.
//   - `text-white`, `text-gray-200`: Ensures text is visible.
//   - `hover:bg-gray-800`: Darker hover state for links.
//   - `bg-purple-600 hover:bg-purple-700`: Purple logout button.
// */





// src/components/Navbar.jsx
import React, { useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function for smooth scrolling to anchor links on the landing page
  const scrollToSection = useCallback((sectionId) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  return (
    <nav className="fixed w-full z-20 top-0 left-0 bg-transparent backdrop-blur-md p-4 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-purple-400 transform hover:scale-105 transition-transform duration-300">
          Excel Analytics
        </Link>
        <div className="space-x-8 text-lg font-medium">
          {user ? (
            <>
              {/* Links for Logged-In User */}
              <Link to="/dashboard" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="px-6 py-2 rounded-full font-bold bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-lg text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Links for Landing Page (Unauthenticated User) */}
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                Features
              </a>
              <a href="#cta" onClick={(e) => { e.preventDefault(); scrollToSection('cta'); }} className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                Get Started
              </a>
              <Link to="/login" className="px-6 py-2 rounded-full font-bold bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-lg text-white">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

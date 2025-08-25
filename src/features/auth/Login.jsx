// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const { email, password } = formData;

//   const navigate = useNavigate();
//   const { user, isLoading, isError, message, login, resetAuthStatus } = useAuth();

//   useEffect(() => {
//     console.log('Login.jsx useEffect triggered. Current user:', user, 'isError:', isError, 'message:', message); // DEBUG LOG

//     if (isError) {
//       console.error("Login.jsx Error:", message);
//       alert(`Login Error: ${message}`);
//       resetAuthStatus();
//     }

//     if (user) {
//       console.log('Login.jsx: User found, navigating to dashboard.'); // DEBUG LOG
//       navigate('/dashboard');
//     }
//   }, [user, isError, message, navigate, resetAuthStatus]);

//   const onChange = (e) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     const userData = {
//       email,
//       password,
//     };

//     console.log('Login.jsx: Attempting login with userData:', userData); // DEBUG LOG
//     try {
//       await login(userData);
//       console.log('Login.jsx: Login function from context called successfully.'); // DEBUG LOG
//     } catch (error) {
//       console.error('Login.jsx: Login attempt failed in component catch block.'); // DEBUG LOG
//       // Error is already handled by context, but this catch block can be used for component-specific reactions
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
//         <p className="ml-4 text-lg text-gray-300">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
//         <h2 className="text-3xl font-bold text-center mb-6 text-white">Login</h2>
//         <form onSubmit={onSubmit}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={email}
//               onChange={onChange}
//               className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={onChange}
//               className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
//               placeholder="Enter your password"
//               required
//             />
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out w-full shadow-lg"
//             >
//               Login
//             </button>
//           </div>
//           <p className="text-center text-gray-400 text-sm mt-4">
//             Don't have an account?{' '}
//             <button
//               type="button"
//               onClick={() => navigate('/register')}
//               className="text-purple-400 hover:text-purple-300 font-bold focus:outline-none"
//             >
//               Register
//             </button>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;







// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import LandingPage from './landing/LandingPage';

// // Import your existing components
// import Login from './features/auth/Login';
// import Register from './features/auth/Register';
// import Dashboard from './components/Dashboard';
// import PrivateRoute from './components/PrivateRoute';
// import Navbar from './components/Navbar';
// import ViewFile from './components/ViewFile';

// // Import the global components from the landing page
// import { CustomCursor, ThreeDBackground } from './landing/LandingPage';

// function App() {
//   const { user } = useAuth();

//   return (
//     <Router>
//       <div className="bg-gradient-to-br from-gray-900 to-black text-gray-100 font-inter min-h-screen">
//         <CustomCursor />
//         <ThreeDBackground />
        
//         <Navbar />

//         <main>
//           <Routes>
//             {/*
//               --- FIX ---
//               The root path '/' now *always* renders the LandingPage.
//               This prevents the auto-redirection to the dashboard.
//             */}
//             <Route path="/" element={<LandingPage />} />
            
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Protected routes remain the same, requiring a user to be logged in */}
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <Dashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/dashboard/:id"
//               element={
//                 <PrivateRoute>
//                   <ViewFile />
//                 </PrivateRoute>
//               }
//             />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;








// src/features/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // CORRECTED PATH

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const { user, isLoading, isError, message, login, resetAuthStatus } = useAuth();

  useEffect(() => {
    if (isError) {
      console.error(message);
      alert(`Login Error: ${message}`);
      resetAuthStatus();
    }
    // Check if the user is logged in and redirect to the dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, isError, message, navigate, resetAuthStatus]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    try {
      await login(userData);
    } catch (error) {
      console.log('Login attempt failed in component.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] relative z-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-lg text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-64px)]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Login</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out w-full shadow-lg"
            >
              Login
            </button>
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-purple-400 hover:text-purple-300 font-bold focus:outline-none"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     password2: '', // For password confirmation
//   });

//   const { username, email, password, password2 } = formData;

//   const navigate = useNavigate();
//   const { user, isLoading, isError, message, register, resetAuthStatus } = useAuth();

//   useEffect(() => {
//     if (isError) {
//       console.error(message);
//       alert(`Registration Error: ${message}`);
//       resetAuthStatus();
//     }

//     if (user) {
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

//     if (password !== password2) {
//       alert('Passwords do not match');
//       return;
//     }

//     const userData = {
//       username,
//       email,
//       password,
//     };

//     try {
//       await register(userData);
//     } catch (error) {
//       console.log('Registration attempt failed in component.', error);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div> {/* Spinner color adjusted */}
//         <p className="ml-4 text-lg text-gray-300">Loading...</p> {/* Text color adjusted */}
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
//       {/* Darker background for the form, lighter text */}
//       <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
//         <h2 className="text-3xl font-bold text-center mb-6 text-white">Register</h2>
//         <form onSubmit={onSubmit}>
//           <div className="mb-4">
//             <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={username}
//               onChange={onChange}
//               className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
//               placeholder="Enter your username"
//               required
//             />
//           </div>
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
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={onChange}
//               className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
//               placeholder="Enter your password"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="password2" className="block text-gray-300 text-sm font-bold mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="password2"
//               name="password2"
//               value={password2}
//               onChange={onChange}
//               className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
//               placeholder="Confirm password"
//               required
//             />
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out w-full shadow-lg"
//             >
//               Register
//             </button>
//           </div>
//           <p className="text-center text-gray-400 text-sm mt-4">
//             Already have an account?{' '}
//             <button
//               type="button"
//               onClick={() => navigate('/login')}
//               className="text-purple-400 hover:text-purple-300 font-bold focus:outline-none"
//             >
//               Login
//             </button>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;

// /*
//   Explanation for src/features/auth/Register.jsx:
//   - Styling changes mirror those in Login.jsx for consistency with the dark theme.
// */







// src/features/auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', // For password confirmation
  });

  const { username, email, password, password2 } = formData;

  const navigate = useNavigate();
  const { user, isLoading, isError, message, register, resetAuthStatus } = useAuth();

  useEffect(() => {
    if (isError) {
      console.error(message);
      alert(`Registration Error: ${message}`);
      resetAuthStatus();
    }

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

    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      username,
      email,
      password,
    };

    try {
      await register(userData);
    } catch (error) {
      console.log('Registration attempt failed in component.', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen pt-20 relative z-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div> {/* Spinner color adjusted */}
        <p className="ml-4 text-lg text-gray-300">Loading...</p> {/* Text color adjusted */}
      </div>
    );
  }

  return (
    // Add 'relative z-10' to bring this container to the foreground
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] pt-20 relative z-10">
      {/* Darker background for the form, with semi-transparent effect */}
      <div className="bg-gray-800/80 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Register</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter your username"
              required
            />
          </div>
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
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password2" className="block text-gray-300 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              className="shadow appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-gray-100 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out w-full shadow-lg"
            >
              Register
            </button>
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-purple-400 hover:text-purple-300 font-bold focus:outline-none"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

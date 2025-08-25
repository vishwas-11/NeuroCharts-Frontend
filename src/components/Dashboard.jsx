// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import UploadForm from './UploadForm';
// import UploadHistory from './UploadHistory';

// function Dashboard() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [refreshHistory, setRefreshHistory] = useState(false);

//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
//         <p className="text-lg text-gray-300">Redirecting to login...</p>
//       </div>
//     );
//   }

//   const handleUploadSuccess = () => {
//     setRefreshHistory(prev => !prev);
//   };

//   return (
//     <div className="p-6 bg-gray-800/80 rounded-lg shadow-xl border border-gray-700 relative z-10 pt-20 pb-20"> 
//       <h1 className="text-4xl font-bold text-white mb-6 text-center">
//         Welcome to your Dashboard, {user.username}!
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         <div className="lg:col-span-1">
//           <UploadForm onUploadSuccess={handleUploadSuccess} />
//         </div>

//         <div className="lg:col-span-1">
//           <UploadHistory key={refreshHistory} />
//         </div>
//       </div>
      
//       {/* NEW: Conditional rendering for Admin/Superadmin-only card */}
//       {user.role === 'admin' || user.role === 'superadmin' ? (
//         <div className="bg-red-900/60 p-6 rounded-lg shadow-md border border-red-700 text-gray-100 mt-6 text-center">
//           <h2 className="text-2xl font-semibold text-red-300 mb-3">Admin Panel</h2>
//           <p className="text-gray-200 mb-4">
//             Manage users and system data.
//           </p>
//           <button
//             onClick={() => navigate('/admin-panel')}
//             className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
//           >
//             Go to Admin
//           </button>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// export default Dashboard;







// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UploadForm from './UploadForm';
import UploadHistory from './UploadHistory';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [refreshHistory, setRefreshHistory] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p className="text-lg text-gray-300">Redirecting to login...</p>
      </div>
    );
  }

  const handleUploadSuccess = () => {
    setRefreshHistory(prev => !prev);
  };

  return (
    // Set padding-top to account for the navbar and use a semi-transparent background
    <div className="p-6 bg-gray-800/60 rounded-lg shadow-xl border border-gray-700 relative z-10 pt-20 pb-20"> 
      <h1 className="text-4xl font-bold text-white mb-6 text-center">
        Welcome to your Dashboard, {user.username}!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="lg:col-span-1">
          {/* This component's background will also be translucent now */}
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        </div>  

        <div className="lg:col-span-1">
          {/* This component's background will also be translucent now */}
          <UploadHistory key={refreshHistory} />
        </div>
      </div>
      
      {/* Conditionally render buttons based on user role */}
      {user.role === 'admin' || user.role === 'superadmin' ? (
        <div className="bg-red-900/60 p-6 rounded-lg shadow-md border border-red-700 text-gray-100 mt-6 text-center">
          <h2 className="text-2xl font-semibold text-red-300 mb-3">Admin Panel</h2>
          <p className="text-gray-200 mb-4">
            Manage users and system data.
          </p>
          <button
            onClick={() => navigate('/admin-panel')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Go to Admin
          </button>
        </div>
      ) : (
        <div className="p-6 bg-purple-900/60 rounded-lg shadow-md border border-purple-700 text-gray-100 mt-6 text-center">
          <h2 className="text-2xl font-semibold text-purple-300 mb-3">Data Visualization</h2>
          <p className="text-gray-200 mb-4">
            Select a file from your history to start creating charts.
          </p>
          <button
            onClick={() => navigate('/chart-studio')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Go to Chart Studio
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

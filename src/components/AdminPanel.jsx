import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../features/auth/authService';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalFiles: 0 });
  const [roleRequests, setRoleRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasPendingRequest, setHasPendingRequest] = useState(false); // NEW: State to track pending requests
  const { user } = useAuth();

  const fetchUsersAndMetrics = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [fetchedUsers, totalUsers, totalFiles] = await Promise.all([
        authService.getAllUsers(),
        authService.getTotalUsers(),
        authService.getTotalFiles()
      ]);
      setUsers(fetchedUsers);
      setMetrics({ totalUsers, totalFiles });

      // FIX: Only fetch role requests if the user is a superadmin
      if (user.role === 'superadmin') {
        const requests = await authService.getRoleRequests();
        setRoleRequests(requests);
      }
      
      // NEW: Check if the current user has a pending request
      if (user.role === 'admin') {
          const allRequests = await authService.getRoleRequests();
          const pending = allRequests.some(req => req.userId._id === user.id && req.status === 'pending');
          setHasPendingRequest(pending);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. You may not have the required permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndMetrics();
  }, [user]);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    try {
      await authService.updateUserRole(userId, newRole);
      fetchUsersAndMetrics();
    } catch (err) {
      console.error('Error updating user role:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update user role.';
      alert(errorMessage);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await authService.deleteUser(userId);
      fetchUsersAndMetrics();
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete user.';
      alert(errorMessage);
    }
  };

  const handleUpdateRequest = async (requestId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this request?`)) {
      return;
    }
    try {
      await authService.updateRoleRequest(requestId, newStatus);
      fetchUsersAndMetrics();
    } catch (err) {
      console.error('Error updating role request:', err);
      const errorMessage = err.response?.data?.message || `Failed to ${newStatus} role request.`;
      alert(errorMessage);
    }
  };
  
  // NEW: Function to handle the superadmin role request
  // const handleRequestSuperadmin = async () => {
  //     try {
  //         await authService.submitRoleRequest();
  //         setHasPendingRequest(true); // Update state to disable the button
  //         alert('Your request for the superadmin role has been submitted!');
  //     } catch (err) {
  //         console.error('Error submitting role request:', err);
  //         const errorMessage = err.response?.data?.message || 'Failed to submit role request.';
  //         alert(errorMessage);
  //     }
  // };


  const handleRequestSuperadmin = async () => {
  try {
    const res = await authService.submitRoleRequest();
    setHasPendingRequest(true);
    alert(res.message || 'Your request has been submitted!');
  } catch (err) {
    console.error('Error submitting role request:', err);
    const errorMessage = err.response?.data?.message || 'Failed to submit role request.';
    alert(errorMessage);
  }
};



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px] relative z-10 p-6 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-300">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/60 p-6 rounded-lg shadow-xl border border-red-700 text-center relative z-10 pt-20">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800/60 rounded-lg shadow-xl border border-gray-700 relative z-10 pt-20 pb-20">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">Admin Panel</h1>
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-700/60 p-6 rounded-lg shadow-md text-center border border-gray-600">
          <h3 className="text-2xl font-semibold text-purple-400">Total Users</h3>
          <p className="text-4xl font-bold text-white mt-2">{metrics.totalUsers}</p>
        </div>
        <div className="bg-gray-700/60 p-6 rounded-lg shadow-md text-center border border-gray-600">
          <h3 className="text-2xl font-semibold text-blue-400">Total Files Uploaded</h3>
          <p className="text-4xl font-bold text-white mt-2">{metrics.totalFiles}</p>
        </div>
      </div>

      <p className="text-gray-400 text-center mb-6">
        {user.role === 'superadmin' 
          ? 'As a Superadmin, you can manage all users and their roles and approve superadmin requests.'
          : 'As an Admin, you can view all users and request superadmin permissions.'
        }
      </p>

      {/* NEW: Admin Request Section */}
      {user.role === 'admin' && (
          <div className="mb-8">
              <button
                  onClick={handleRequestSuperadmin}
                  disabled={hasPendingRequest}
                  className={`py-2 px-4 rounded-full font-bold text-white transition-all duration-300 shadow-lg ${hasPendingRequest ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                  {hasPendingRequest ? 'Request Pending' : 'Request Superadmin Role'}
              </button>
          </div>
      )}

      {/* Role Requests for Superadmins */}
      {user.role === 'superadmin' && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Role Requests</h2>
          {roleRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700/60 text-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-600 bg-gray-900/60 text-left text-sm font-semibold uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 border-b-2 border-gray-600 bg-gray-900/60 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 border-b-2 border-gray-600 bg-gray-900/60 text-left text-sm font-semibold uppercase tracking-wider">Requested On</th>
                    <th className="px-6 py-3 border-b-2 border-gray-600 bg-gray-900/60 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roleRequests.map(req => (
                    <tr key={req._id} className="hover:bg-gray-600/70 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-600">{req.userId.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-600">{req.userId.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-600 space-x-2">
                        <button
                          onClick={() => handleUpdateRequest(req._id, 'approved')}
                          className="bg-green-600 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-green-700 transition duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateRequest(req._id, 'denied')}
                          className="bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-red-700 transition duration-200"
                        >
                          Deny
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-400">No pending role requests.</p>
          )}
        </div>
      )}

      <h2 className="text-3xl font-bold text-white mb-4">All Users</h2>
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700/60 text-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-600 bg-gray-900/60 text-left text-sm font-semibold uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 border-b-2 border-gray-600 bg-gray-900/60 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 border-b-2 border-gray-600 bg-gray-900/60 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
                {user.role === 'superadmin' && (
                  <th className="px-6 py-3 border-b-2 border-gray-600 bg-gray-900/60 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-600/70 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-600">{u.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-600">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-600 capitalize">{u.role}</td>
                  {user.role === 'superadmin' && (
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-600 space-x-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-gray-900/50 text-gray-300 rounded-md p-1 border border-gray-600"
                        disabled={u.role === 'superadmin'} // Cannot change the role of a superadmin
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-red-700 transition duration-200"
                        disabled={u.role === 'superadmin'} // Cannot delete a superadmin
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">No users found.</p>
      )}
    </div>
  );
}

export default AdminPanel;



// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../features/auth/authService';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Logged-in user

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedUsers = await authService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. You may not have the required permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    try {
      await authService.updateUserRole(userId, newRole);
      fetchUsers(); // Refresh the user list
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
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete user.';
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
      <p className="text-gray-400 text-center mb-6">
        {user.role === 'superadmin' 
          ? 'As a Superadmin, you can manage all users and their roles.'
          : 'As an Admin, you can view all users, but cannot change roles or delete them.'
        }
      </p>

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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../features/auth/authService';
import { useAuth } from '../context/AuthContext';

function UploadHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const { user } = useAuth();

  const handleRemove = async (e, id) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the parent Link from being triggered
    if (window.confirm('Are you sure you want to remove this file?')) {
      try {
        await authService.deleteExcelData(id);
        // Refresh the history list after successful deletion
        setHistory(history.filter(item => item._id !== id));
      } catch (err) {
        console.error('Failed to delete file:', err);
        alert('Failed to delete file. You may not have the permission to delete this file.');
      }
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError('');
        const data = await authService.getUploadHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch upload history:', err);
        setError('Failed to load upload history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // Filter history based on selected user
  const filteredHistory = selectedUser
    ? history.filter(item => item.userId && item.userId._id === selectedUser)
    : history;
  
  // Get unique users for the filter dropdown
  const uniqueUsers = Array.from(new Set(history.map(item => item.userId && item.userId._id)))
    .map(userId => history.find(item => item.userId && item.userId._id === userId)?.userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[200px] bg-gray-800 rounded-lg p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-300">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center text-red-400 border border-red-700">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/60 p-6 rounded-lg shadow-xl border border-gray-700 h-full relative z-10">
      <h2 className="text-2xl font-semibold text-white mb-4">
        {user.role === 'admin' || user.role === 'superadmin' ? 'All Uploads' : 'Upload History'}
      </h2>

      {(user.role === 'admin' || user.role === 'superadmin') && (
        <div className="mb-4">
          <label htmlFor="user-filter" className="text-gray-400 text-sm mr-2">Filter by User:</label>
          <select 
            id="user-filter" 
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-gray-900/50 text-gray-300 rounded-md p-1 border border-gray-600"
            value={selectedUser}
          >
            <option value="">All Users</option>
            {uniqueUsers.filter(Boolean).map(u => (
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
        </div>
      )}

      {filteredHistory.length > 0 ? (
        <ul className="space-y-4">
          {filteredHistory.map((item) => (
            <Link key={item._id} to={`/dashboard/${item._id}`} className="block">
              <li className="bg-gray-700/60 p-4 rounded-lg shadow-md hover:bg-gray-600/70 transition-colors duration-200 cursor-pointer group flex flex-col sm:flex-row justify-between relative">
                <div>
                  <span className="text-lg font-medium text-gray-200 block">{item.fileName}</span>
                  <span className="text-xs text-gray-400 mt-1 block">Sheet: {item.sheetName}</span>
                  {/* Display uploader info for admin/superadmin */}
                  {(user.role === 'admin' || user.role === 'superadmin') && item.userId && (
                    <span className="text-xs text-purple-400 mt-1 block">Uploaded by: {item.userId.username}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  <span className="text-sm text-gray-400 whitespace-nowrap">
                    {new Date(item.uploadDate).toLocaleDateString()}
                  </span>
                  
                  {/* The remove button only shows for the user who uploaded the file or for admin/superadmin */}
                  {(user.id === item.userId?._id || user.role === 'admin' || user.role === 'superadmin') && (
                    <button
                      onClick={(e) => handleRemove(e, item._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400 mt-10">No upload history found. Upload a file to get started!</p>
      )}
    </div>
  );
}

export default UploadHistory;







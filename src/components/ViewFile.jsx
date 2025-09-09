import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../features/auth/authService';

function ViewFile() {
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams(); // Get the ID from the URL parameter
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        setIsLoading(true);
        const data = await authService.getExcelDataById(id);
        setFileData(data.data);
      } catch (err) {
        console.error('Failed to fetch file data:', err);
        setError('Failed to load file data. You may not have access or the file does not exist.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFileData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-300">Loading file data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/60 p-6 rounded-lg shadow-xl border border-red-700 text-center relative z-10 pt-20">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="bg-gray-800/60 p-6 rounded-lg shadow-xl border border-gray-700 text-center relative z-10 pt-20">
        <p className="text-gray-400">No data found for this file.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    // Corrected layout with top padding and translucent background
    <div className="p-6 bg-gray-800/60 rounded-lg shadow-xl border border-gray-700 relative z-10 pt-20 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">File: {fileData.fileName}</h1>
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <p className="text-gray-400 mb-4">Sheet: {fileData.sheetName}</p>

      {/* Displaying a table with the parsed data */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-gray-700/60 text-gray-200">
          <thead>
            <tr>
              {/* Table headers from the Excel headers */}
              {fileData.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 border-b-2 border-gray-600 bg-gray-900/60 text-left text-sm font-semibold uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Table rows from the Excel data */}
            {fileData.data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-600/70 transition-colors duration-150">
                {fileData.headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap border-b border-gray-600">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewFile;

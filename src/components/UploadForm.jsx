// // src/components/UploadForm.jsx
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import authService from '../features/auth/authService';

// function UploadForm({ onUploadSuccess }) {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const { user } = useAuth();

//   const handleFileChange = (event) => {
//     // Get the selected file from the input
//     const file = event.target.files[0];
//     if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
//       setSelectedFile(file);
//       setMessage('');
//     } else {
//       setSelectedFile(null);
//       setMessage('Please select a valid Excel file (.xls or .xlsx)');
//     }
//   };

//   const handleUpload = async (event) => {
//     event.preventDefault();

//     if (!selectedFile) {
//       setMessage('Please select a file to upload.');
//       return;
//     }

//     setIsLoading(true);
//     setMessage('');

//     try {
//       // Create FormData to send the file
//       const formData = new FormData();
//       formData.append('excelFile', selectedFile); // 'excelFile' must match the field name in your backend router

//       // Call the upload service function
//       const response = await authService.uploadExcel(formData);
//       setMessage(response.message || 'File uploaded successfully!');
//       setSelectedFile(null); // Clear the selected file
      
//       // Notify the parent component (Dashboard) of the successful upload
//       // so it can refresh the history list
//       if (onUploadSuccess) {
//         onUploadSuccess();
//       }

//     } catch (error) {
//       console.error('File upload failed:', error);
//       const errorMessage = error.response?.data?.message || 'An unexpected error occurred during upload.';
//       setMessage(`Error: ${errorMessage}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
//       <h2 className="text-2xl font-semibold text-white mb-4">Upload Excel File</h2>
//       <form onSubmit={handleUpload}>
//         <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
//           <input
//             type="file"
//             name="excelFile"
//             id="excelFile"
//             onChange={handleFileChange}
//             accept=".xls, .xlsx"
//             className="w-full md:w-auto text-sm text-gray-400
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-lg file:border-0
//               file:text-sm file:font-semibold
//               file:bg-purple-700 file:text-white
//               hover:file:bg-purple-600
//               transition duration-200"
//           />
//           <button
//             type="submit"
//             disabled={isLoading || !selectedFile}
//             className={`
//               py-2 px-6 rounded-lg font-bold text-white
//               transition duration-200 shadow-md
//               ${isLoading || !selectedFile
//                 ? 'bg-gray-600 cursor-not-allowed'
//                 : 'bg-green-600 hover:bg-green-700'
//               }`}
//           >
//             {isLoading ? 'Uploading...' : 'Upload'}
//           </button>
//         </div>
//         {message && (
//           <p className={`text-sm mt-2 ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
//             {message}
//           </p>
//         )}
//         {selectedFile && !message && (
//           <p className="text-sm mt-2 text-gray-400">
//             Selected file: <span className="font-medium text-white">{selectedFile.name}</span>
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }

// export default UploadForm;

// /*
//   Explanation for src/components/UploadForm.jsx:
//   - `useState` for `selectedFile`, `isLoading`, and `message` to handle component state.
//   - `handleFileChange`: Validates the selected file type (`.xls`, `.xlsx`).
//   - `handleUpload`:
//     - Prevents default form submission.
//     - Creates `FormData` to send the file.
//     - Calls the new `authService.uploadExcel` function.
//     - Handles success and error messages.
//     - Calls `onUploadSuccess` (a prop from the parent) to trigger a data refresh.
//   - Tailwind CSS Styling: Uses a dark theme with vibrant button colors. The file input is styled to be more appealing with custom classes.
//   - Conditional rendering: Displays a loading state, success/error messages, and the name of the selected file.
// */








// src/components/UploadForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../features/auth/authService';

function UploadForm({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleFileChange = (event) => {
    // Get the selected file from the input
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
      setSelectedFile(file);
      setMessage('');
    } else {
      setSelectedFile(null);
      setMessage('Please select a valid Excel file (.xls or .xlsx)');
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('excelFile', selectedFile); // 'excelFile' must match the field name in your backend router

      // Call the upload service function
      const response = await authService.uploadExcel(formData);
      setMessage(response.message || 'File uploaded successfully!');
      setSelectedFile(null); // Clear the selected file
      
      // Notify the parent component (Dashboard) of the successful upload
      // so it can refresh the history list
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error('File upload failed:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred during upload.';
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 'relative' and 'z-10' are already on the parent of this component (Dashboard)
    // but adding them here is good practice for encapsulated components.
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 relative z-10">
      <h2 className="text-2xl font-semibold text-white mb-4">Upload Excel File</h2>
      <form onSubmit={handleUpload}>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <input
            type="file"
            name="excelFile"
            id="excelFile"
            onChange={handleFileChange}
            accept=".xls, .xlsx"
            className="w-full md:w-auto text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-700 file:text-white
              hover:file:bg-purple-600
              transition duration-200"
          />
          <button
            type="submit"
            disabled={isLoading || !selectedFile}
            className={`
              py-2 px-6 rounded-lg font-bold text-white
              transition duration-200 shadow-md
              ${isLoading || !selectedFile
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {message && (
          <p className={`text-sm mt-2 ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
        {selectedFile && !message && (
          <p className="text-sm mt-2 text-gray-400">
            Selected file: <span className="font-medium text-white">{selectedFile.name}</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default UploadForm;

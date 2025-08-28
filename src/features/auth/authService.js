import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';
const EXCEL_API_URL = 'http://localhost:3000/api/excel/';
const ADMIN_API_URL = 'http://localhost:3000/api/admin/';

const getToken = () => localStorage.getItem('token');

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Function to upload a file
const uploadExcel = async (formData) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.post(EXCEL_API_URL + 'upload', formData, config);
  return response.data;
};

// Function to get upload history
const getUploadHistory = async () => {
  const token = getToken();
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.get(EXCEL_API_URL + 'history', config);
  return response.data.history;
};

// Function to get a specific Excel file's data by ID
const getExcelDataById = async (id) => {
  const token = getToken();
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.get(EXCEL_API_URL + id, config);
  return response.data;
};

// Function to delete an Excel file by ID
const deleteExcelData = async (id) => {
  const token = getToken();
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.delete(EXCEL_API_URL + id, config);
  return response.data;
};

// Function to get AI insights from a file
const getAiInsights = async (fileId, prompt) => {
    const token = getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    const response = await axios.post(EXCEL_API_URL + 'insights', { fileId, prompt }, config);
    return response.data;
};

// Get all users
const getAllUsers = async () => {
  const token = getToken();
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.get(ADMIN_API_URL + 'users', config);
  return response.data.users;
};

// Update a user's role (Superadmin only)
const updateUserRole = async (userId, role) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.put(ADMIN_API_URL + `users/${userId}/role`, { role }, config);
  return response.data;
};

// Delete a user (Superadmin only)
const deleteUser = async (userId) => {
  const token = getToken();
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.delete(ADMIN_API_URL + `users/${userId}`, config);
  return response.data;
};

// Get total user count
const getTotalUsers = async () => {
  const token = getToken();
  const config = {
    headers: { 'Authorization': `Bearer ${token}` }
  };
  const response = await axios.get(ADMIN_API_URL + 'metrics/users', config);
  return response.data.totalUsers;
};

// Get total file count
const getTotalFiles = async () => {
  const token = getToken();
  const config = {
    headers: { 'Authorization': `Bearer ${token}` }
  };
  const response = await axios.get(ADMIN_API_URL + 'metrics/files', config);
  return response.data.totalFiles;
};

// --- NEW FUNCTIONS: For role requests ---
const submitRoleRequest = async () => {
  const token = getToken();
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.post(ADMIN_API_URL + 'role-request', {}, config);
  return response.data;
};

const getRoleRequests = async () => {
  const token = getToken();
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.get(ADMIN_API_URL + 'role-requests', config);
  return response.data.requests;
};

const updateRoleRequest = async (requestId, status) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await axios.put(ADMIN_API_URL + `role-request/${requestId}`, { status }, config);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  uploadExcel,
  getUploadHistory,
  getExcelDataById,
  deleteExcelData,
  getAiInsights,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getTotalUsers,
  getTotalFiles,
  submitRoleRequest,
  getRoleRequests,
  updateRoleRequest
};

export default authService;

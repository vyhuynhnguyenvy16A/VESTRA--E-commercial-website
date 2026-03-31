import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
}

export const updateUserStatus = async (userId, status) => {
  const response = await api.put(`/admin/users/${userId}/status`, { status });
  return response.data;
}

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
}

export const getAllReports = async () => {
  const response = await api.get('/admin/reports');
  return response.data;
}

export const updateReportStatus = async (reportId, status) => {
  const response = await api.put(`/admin/reports/${reportId}`, { status });
  return response.data;
}
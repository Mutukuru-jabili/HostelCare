import axios from 'axios';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8909/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('hostelcare_user') || 'null');
  if (user) {
    config.headers['X-Role'] = user.role;
    config.headers['X-User-Id'] = user.id;
  }
  return config;
});

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
};

export const complaintApi = {
  createComplaint: (payload, image) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (image) formData.append('image', image);
    return api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { studentId: payload.studentId },
    });
  },
  getStudentComplaints: (studentId) => api.get(`/complaints/student/${studentId}`),
  getComplaintById: (id, studentId) => api.get(`/complaints/${id}`, { params: { studentId } }),
  getAllComplaints: () => api.get('/admin/complaints'),
  updateStatus: (id, status) => api.put(`/admin/complaints/${id}/status`, null, { params: { status } }),
  updatePriority: (id, priority) => api.put(`/admin/complaints/${id}/priority`, null, { params: { priority } }),
  assignStaff: (id, assignedStaff) => api.put(`/admin/complaints/${id}/assign`, null, { params: { assignedStaff } }),
  getStatistics: () => api.get('/admin/statistics'),
};

export default api;

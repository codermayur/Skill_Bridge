const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('userToken');
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  signup: async (fullName, email, password) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });
  },

  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  forgotPassword: async (email) => {
    return apiCall('/auth/forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (resetToken, password) => {
    return apiCall(`/auth/resetpassword/${resetToken}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiCall('/user/profile');
  },

  updateProfile: async (fullName, email, bio, skills) => {
    return apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName, email, bio, skills }),
    });
  },
};

// Test Scores API
export const testScoreAPI = {
  submitScore: async (language, score, totalQuestions, answers = []) => {
    return apiCall('/testscores', {
      method: 'POST',
      body: JSON.stringify({
        language,
        score,
        totalQuestions,
        answers,
      }),
    });
  },

  getScores: async () => {
    return apiCall('/testscores');
  },

  getScoresByLanguage: async (language) => {
    return apiCall(`/testscores/${language}`);
  },
};

// Requests API
export const requestAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiCall(`/requests${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => apiCall(`/requests/${id}`),
  create: (data) => apiCall('/requests', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) =>
    apiCall(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  accept: (id) => apiCall(`/requests/${id}/accept`, { method: 'POST' }),
  getMyRequests: () => apiCall('/requests/me/requests'),
  getMyHelping: () => apiCall('/requests/me/helping'),
  getMatches: (id) => apiCall(`/requests/${id}/matches`),
};

// Notifications API
export const notificationAPI = {
  getAll: (page = 1) => apiCall(`/notifications?page=${page}`),
  markAsRead: (id) => apiCall(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => apiCall('/notifications/read-all', { method: 'PATCH' }),
  delete: (id) => apiCall(`/notifications/${id}`, { method: 'DELETE' }),
};

// Messages API
export const messageAPI = {
  getMessages: (requestId) => apiCall(`/messages/${requestId}`),
  sendMessage: (requestId, content) =>
    apiCall(`/messages/${requestId}`, { method: 'POST', body: JSON.stringify({ content }) }),
};

// Reviews API
export const reviewAPI = {
  create: (data) => apiCall('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getHelperReviews: (helperId) => apiCall(`/reviews/helper/${helperId}`),
  getRequestReview: (requestId) => apiCall(`/reviews/request/${requestId}`),
};

// Admin API (requires admin role)
export const adminAPI = {
  getStats: () => apiCall('/admin/stats'),
  getUsers: (page = 1) => apiCall(`/admin/users?page=${page}`),
  getUserById: (id) => apiCall(`/admin/users/${id}`),
  banUser: (id, isBanned) =>
    apiCall(`/admin/users/${id}/ban`, {
      method: 'PATCH',
      body: JSON.stringify({ isBanned }),
    }),
};

export default {
  authAPI,
  userAPI,
  testScoreAPI,
  requestAPI,
  notificationAPI,
  messageAPI,
  reviewAPI,
  adminAPI,
};

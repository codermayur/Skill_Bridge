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

  updateProfile: async (fullName, email) => {
    return apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName, email }),
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

export default {
  authAPI,
  userAPI,
  testScoreAPI,
};

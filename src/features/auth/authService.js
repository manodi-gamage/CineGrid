// src/features/auth/authService.js
import axios from 'axios';
import {
  storeTokens,
  getAccessToken,
  getRefreshToken,
  storeUserData,
  clearAuthData,
} from './authStorage';

const API_BASE_URL = 'https://dummyjson.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
          expiresInMins: 30,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await storeTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearAuthData();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Login user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data with tokens
 */
export const login = async (username, password) => {
  try {
    // Clear any existing auth data before login to prevent conflicts
    await clearAuthData();
    
    // Make login request without interceptor (no auth header needed)
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
      expiresInMins: 30,
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { accessToken, refreshToken, ...userData } = response.data;

    // Store tokens and user data
    await storeTokens(accessToken, refreshToken);
    await storeUserData(userData);

    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    
    // Provide user-friendly error messages
    if (error.response?.status === 400) {
      throw new Error('Invalid username or password');
    } else if (error.response?.status === 401) {
      throw new Error('Invalid credentials');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection');
    } else if (!error.response) {
      throw new Error('Network error. Please check your internet connection');
    }
    
    throw new Error('Login failed. Please try again');
  }
};

/**
 * Register new user (simulated with DummyJSON)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user data
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/users/add', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      age: userData.age || 25,
    });

    // Note: DummyJSON doesn't persist data, so this is just for demo
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection');
    } else if (!error.response) {
      throw new Error('Network error. Please check your internet connection');
    }
    
    throw new Error('Registration failed. Please try again');
  }
};

/**
 * Get current authenticated user's data
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    
    // Update stored user data
    await storeUserData(response.data);
    
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error.response?.data || error.message);
    throw new Error('Failed to fetch user data');
  }
};

/**
 * Refresh authentication tokens
 * @returns {Promise<Object>} New tokens
 */
export const refreshAuthToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
      expiresInMins: 30,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    await storeTokens(accessToken, newRefreshToken);

    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    await clearAuthData();
    throw new Error('Session expired. Please login again');
  }
};

/**
 * Logout user by clearing all stored data
 */
export const logout = async () => {
  try {
    await clearAuthData();
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * Get all users (for testing/demo purposes)
 * @returns {Promise<Array>} List of users
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data.users;
  } catch (error) {
    console.error('Get users error:', error.response?.data || error.message);
    throw new Error('Failed to fetch users');
  }
};

export default apiClient;

import api from '../api';

const getAuthHeader = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
  }
});

const handleError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.message || 'An error occurred',
      data: error.response.data
    };
  }
  if (error.request) {
    return {
      status: 503,
      message: 'Service unavailable',
    };
  }
  return {
    status: 500,
    message: 'Unexpected error',
  };
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/users', userData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/users', getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/users/profile', getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
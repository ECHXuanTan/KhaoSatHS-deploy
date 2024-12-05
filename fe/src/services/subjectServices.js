import api from '../api';

export const getAllSubjects = async () => {
  try {
    const response = await api.get('/api/subjects');
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

export const getSubjectById = async (id) => {
  try {
    const response = await api.get(`/api/subjects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subject ${id}:`, error);
    throw error;
  }
};

export const createSubject = async (subjectData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.post('/api/subjects', subjectData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

export const createManySubjects = async (subjectsData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.post('/api/subjects/batch', subjectsData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating multiple subjects:', error);
    throw error;
  }
};

export const updateSubject = async (id, updateData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.put(`/api/subjects/${id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating subject ${id}:`, error);
    throw error;
  }
};

export const deleteSubject = async (id) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.delete(`/api/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting subject ${id}:`, error);
    throw error;
  }
};

export const getSubjectClasses = async (id) => {
  try {
    const response = await api.get(`/api/subjects/${id}/classes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching classes for subject ${id}:`, error);
    throw error;
  }
};

export const getSubjectSurveys = async (id) => {
  try {
    const response = await api.get(`/api/subjects/${id}/surveys`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching surveys for subject ${id}:`, error);
    throw error;
  }
};
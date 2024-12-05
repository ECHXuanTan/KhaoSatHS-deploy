// services/studentServices.js
import api from '../api';

export const getAllStudents = async () => {
  try {
    const response = await api.get('/api/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.post('/api/students', studentData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const createManyStudents = async (studentsData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.post('/api/students/batch', studentsData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating multiple students:', error);
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.put(`/api/students/${id}`, studentData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.delete(`/api/students/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    throw error;
  }
};

export const getStudentClasses = async (id) => {
  try {
    const response = await api.get(`/api/students/${id}/classes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching classes for student ${id}:`, error);
    throw error;
  }
};
// services/teacherServices.js
import api from '../api';

export const getAllTeachers = async () => {
  try {
    const response = await api.get('/api/teachers');
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

export const getTeacherById = async (id) => {
  try {
    const response = await api.get(`/api/teachers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching teacher ${id}:`, error);
    throw error;
  }
};

export const createTeacher = async (teacherData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.post('/api/teachers', teacherData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
};

export const updateTeacher = async (id, updateData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.put(`/api/teachers/${id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating teacher ${id}:`, error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.delete(`/api/teachers/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting teacher ${id}:`, error);
    throw error;
  }
};

export const getTeacherClasses = async (id) => {
  try {
    const response = await api.get(`/api/teachers/${id}/classes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching classes for teacher ${id}:`, error);
    throw error;
  }
};

export const getTeachersByDepartment = async (departmentId) => {
  try {
    const response = await api.get(`/api/teachers/department/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching teachers for department ${departmentId}:`, error);
    throw error;
  }
};
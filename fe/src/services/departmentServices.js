import api from '../api';

export const getAllDepartments = async () => {
  try {
    const response = await api.get('/api/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const getDepartmentById = async (id) => {
  try {
    const response = await api.get(`/api/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department ${id}:`, error);
    throw error;
  }
};

export const createDepartment = async (departmentData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.post('/api/departments', departmentData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

export const createManyDepartments = async (departmentsData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.post('/api/departments/batch', departmentsData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating multiple departments:', error);
    throw error;
  }
};

export const updateDepartment = async (id, updateData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.put(`/api/departments/${id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating department ${id}:`, error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.delete(`/api/departments/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting department ${id}:`, error);
    throw error;
  }
};

export const getDepartmentTeachers = async (id) => {
  try {
    const response = await api.get(`/api/departments/${id}/teachers`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching teachers for department ${id}:`, error);
    throw error;
  }
};

export const getDepartmentSubjects = async (id) => {
  try {
    const response = await api.get(`/api/departments/${id}/subjects`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subjects for department ${id}:`, error);
    throw error;
  }
};
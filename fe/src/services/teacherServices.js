import api from '../api';

const getAuthHeader = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
  }
});

const handleRequestError = (error, operation) => {
  console.error(`Error ${operation}:`, error);
  throw error;
};

export const getAllTeachers = async () => {
  try {
    const response = await api.get('/api/teachers', getAuthHeader());
    return response.data;
  } catch (error) {
    handleRequestError(error, 'fetching all teachers');
  }
};

export const getTeacherById = async (id) => {
  try {
    const response = await api.get(`/api/teachers/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    handleRequestError(error, `fetching teacher ${id}`);
  }
};

export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post('/api/teachers', teacherData, getAuthHeader());
    return response.data;
  } catch (error) {
    handleRequestError(error, 'creating teacher');
  }
};

export const updateTeacher = async (id, updateData) => {
  try {
    const response = await api.put(
      `/api/teachers/${id}`, 
      updateData, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleRequestError(error, `updating teacher ${id}`);
  }
};

export const deleteTeacher = async (id) => {
  try {
    const response = await api.delete(
      `/api/teachers/${id}`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleRequestError(error, `deleting teacher ${id}`);
  }
};

export const getTeacherClasses = async (id) => {
  try {
    const response = await api.get(
      `/api/teachers/${id}/classes`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleRequestError(error, `fetching classes for teacher ${id}`);
  }
};

export const getTeachersByDepartment = async (departmentId) => {
  try {
    const response = await api.get(
      `/api/teachers/department/${departmentId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleRequestError(error, `fetching teachers for department ${departmentId}`);
  }
};

export const createManyTeachers = async (teacherData) => {
  try {
    const response = await api.post('/api/teachers/bulk', teacherData, getAuthHeader());
    return response.data;
  } catch (error) {
    handleRequestError(error, 'creating multiple teachers');
  }
};

export const assignHomeroom = async (teacherId, homeroomData) => {
  try {
    const response = await api.post(
      `/api/teachers/${teacherId}/homeroom`,
      homeroomData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleRequestError(error, `assigning homeroom for teacher ${teacherId}`);
  }
};

export const getHomeroomDetails = async () => {
  try {
    const response = await api.get('/api/teachers/homeroom', getAuthHeader());
    return response.data;
  } catch (error) {
    handleRequestError(error, 'fetching homeroom details');
  }
};

export const getHomeroomHistory = async () => {
  try {
    const response = await api.get(
      '/api/teachers/homeroom/history',
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleRequestError(error, 'fetching homeroom history');
  }
};

export const getClassStudentsWithSurveys = async () => {
  try {
    const response = await api.get(
      '/api/teachers/class/surveys',
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleRequestError(error, 'fetching class students with surveys');
  }
};
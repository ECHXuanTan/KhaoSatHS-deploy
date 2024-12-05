import api from '../api';

const getToken = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
  }
});

export const getAllClasses = async () => {
  try {
    const response = await api.get('/api/classes', getToken());
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

export const getClassById = async (id) => {
  try {
    const response = await api.get(`/api/classes/${id}`, getToken());
    return response.data;
  } catch (error) {
    console.error(`Error fetching class ${id}:`, error);
    throw error;
  }
};

export const createClass = async (classData) => {
  try {
    const response = await api.post('/api/classes', classData, getToken());
    return response.data;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

export const deleteClass = async (id) => {
  try {
    const response = await api.delete(`/api/classes/${id}`, getToken());
    return response.data;
  } catch (error) {
    console.error(`Error deleting class ${id}:`, error);
    throw error;
  }
};

export const createManyClasses = async (classesData) => {
  try {
    const response = await api.post('/api/classes/batch', classesData, getToken());
    return response.data;
  } catch (error) {
    console.error('Error creating multiple classes:', error);
    throw error;
  }
};

export const addTeacherToClass = async (classId, teacherId) => {
  try {
    const response = await api.post(`/api/classes/${classId}/teachers`, { teacherId }, getToken());
    return response.data;
  } catch (error) {
    console.error('Error adding teacher to class:', error);
    throw error;
  }
};

export const getClassStudents = async (classId) => {
  try {
    const response = await api.get(`/api/classes/${classId}/students`, getToken());
    return response.data;
  } catch (error) {
    console.error(`Error fetching students for class ${classId}:`, error);
    throw error;
  }
};

export const addStudentToClass = async (classId, studentId) => {
  try {
      const response = await api.post(
          `/api/classes/${classId}/students`,
          { studentId },
          getToken()
      );
      return response.data;
  } catch (error) {
      console.error('Error adding student to class:', error);
      throw error;
  }
};

export const addManyStudentsToClass = async (classId, studentIds) => {
  try {
      const response = await api.post(
          `/api/classes/${classId}/students/batch`,
          { studentIds },
          getToken()
      );
      return response.data;
  } catch (error) {
      console.error('Error adding students to class:', error);
      throw error;
  }
};

export const removeStudentFromClass = async (classId, studentId) => {
  try {
    const response = await api.delete(`/api/classes/${classId}/students`, {
      ...getToken(),
      data: { studentId }
    });
    return response.data;
  } catch (error) {
    console.error('Error removing student from class:', error);
    throw error;
  }
};

export const removeAllStudentsFromClass = async (classId) => {
  try {
    const response = await api.delete(`/api/classes/${classId}/students/all`, getToken());
    return response.data;
  } catch (error) {
    console.error('Error removing all students from class:', error);
    throw error;
  }
};

export const addStudentsToMultipleClasses = async (classStudentMap) => {
  try {
      const response = await api.post('/api/classes/students/batch', 
          { classStudentMap }, 
          getToken()
      );
      return response.data;
  } catch (error) {
      console.error('Error adding students to multiple classes:', error);
      throw error;
  }
};
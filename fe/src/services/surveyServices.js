import api from '../api';

export const createSurvey = async (surveyData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.post('api/surveys', surveyData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized access');
    }
    throw new Error('Failed to create survey');
  }
};

export const getAllSurveys = async () => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.get('api/surveys',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch surveys');
  }
};

export const getActiveSurveys = async () => {
  try {
    const response = await api.get('api/surveys/active');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch active surveys');
  }
};

export const getSurveysByStudent = async () => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.get('api/surveys/student', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('No surveys found');
    } else if (error.response && error.response.status === 401) {
      throw new Error('Session expired');
    }
    throw new Error('Failed to load surveys. Please try again.');
  }
};

export const getSurveysBySubject = async (subjectId) => {
  try {
    const response = await api.get(`api/surveys/subject/${subjectId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch subject surveys');
  }
};

export const getSurveysByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get('api/surveys/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch surveys by date range');
  }
};

export const getSurveyById = async (id) => {
  try {
    const response = await api.get(`api/surveys/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Survey not found');
    }
    throw new Error('Failed to fetch survey');
  }
};

export const updateSurvey = async (id, surveyData) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.put(`api/surveys/${id}`, surveyData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Survey not found');
    } else if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized access');
    }
    throw new Error('Failed to update survey');
  }
};

export const toggleSurveyActive = async (id) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.patch(`api/surveys/${id}/toggle-active`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Survey not found');
    }
    throw new Error('Failed to toggle survey status');
  }
};

export const extendSurveyEndDate = async (id, newEndDate) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.patch(`api/surveys/${id}/extend`, { newEndDate }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Survey not found');
    }
    throw new Error('Failed to extend survey end date');
  }
};

export const deleteSurvey = async (id) => {
  try {
    const userToken = localStorage.getItem('userToken');
    const response = await api.delete(`api/surveys/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Survey not found');
    }
    throw new Error('Failed to delete survey');
  }
};
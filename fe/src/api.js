import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dkmh-server.click',
  withCredentials: true,
});

export default api;

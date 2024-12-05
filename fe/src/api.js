import axios from 'axios';

const api = axios.create({
  baseURL: 'http://khaosat.xuantan.id.vn/',
  withCredentials: true,
});

export default api;

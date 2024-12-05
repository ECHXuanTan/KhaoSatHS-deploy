import axios from 'axios';

const api = axios.create({
  baseURL: 'https://khaosat.xuantan.id.vn',
  withCredentials: true,
});

export default api;

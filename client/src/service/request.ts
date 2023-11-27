import axios from 'axios';

export const request = axios.create({
  baseURL: import.meta.env.PROD ? '' : import.meta.env.VITE_API_HOST
});

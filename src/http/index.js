import axios from 'axios';
import { getItem } from '../helpers/storage';
import { refreshTokens } from '../redux/auth'; 
import { store } from '../index';

const {
  REACT_APP_API_ROOT = '',
  REACT_APP_API_ENDPOINT = '',
} = process.env;

const http = axios.create({
  baseURL: `${REACT_APP_API_ROOT}${REACT_APP_API_ENDPOINT}`,
  timeout: 20000,
  responseType: 'json',
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
});

http.interceptors.request.use(config => {
  const token = getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';

  return config;
});

http.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    store.dispatch(refreshTokens());
  }
  return Promise.reject(error);
});


export default http;
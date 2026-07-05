import axios from 'axios';

const API = axios.create({
  baseURL: 'https://cartico.onrender.com',
});

export default API;

//imported 
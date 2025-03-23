import axios from "axios";
import { PRODUKCIJA } from "../constants";


export const HttpService = axios.create({
    baseURL: PRODUKCIJA + '/api/v1',
    headers:{
        'Content-Type': 'application/json'
    }
});


HttpService.interceptors.request.use((config) => {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('Bearer');
  
    return config;
  });
  
 HttpService.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        localStorage.setItem('Bearer', '');
        window.location.href = '/';
      }
      //Bez ovoga "Promise.reject..." -> "catch" u ni jednom servisu neće hvatati nikakav error,
      //uvijek će se trigerati samo "then" jer se ovdje uhvati error koji dođe s api-a
      return Promise.reject(error);
    }
  );
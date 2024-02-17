import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import store from './store';
import axios from 'axios';
import './registerServiceWorker'

// Create an instance of Axios with default configuration
const privateAxios = axios.create({
  baseURL: 'http://127.0.0.1:5000',
});

// Add a request interceptor to set the token before sending a request
privateAxios.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            // Set the Authorization header for every request
            config.headers['Authorization'] = `Bearer ${authToken}`;
        } else {
            // If no token is provided, remove the Authorization header
            delete config.headers['Authorization'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


const app = createApp(App);

// Attaching privateAxios to app instance
app.config.globalProperties.$privateAxios = privateAxios;

app.use(router);
app.use(store);

app.mount('#app');
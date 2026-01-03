import axios from 'axios';

// Use environment variable or default to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8083';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (username, password) => {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', 'product-service');
        params.append('client_secret', '5y1n2QKOD9sTqgb9XvSOwCK3upLsqrd6');
        params.append('username', username);
        params.append('password', password);

        const response = await axios.post(
            `${API_BASE_URL}/realms/ecommerce/protocol/openid-connect/token`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    },
};

// Products API
export const productsAPI = {
    getAll: () => api.get('/api/products'),
    getById: (id) => api.get(`/api/products/${id}`),
    create: (data) => api.post('/api/products', data),
    update: (id, data) => api.put(`/api/products/${id}`, data),
    delete: (id) => api.delete(`/api/products/${id}`),
    search: (name) => api.get(`/api/products/search?name=${name}`),
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/api/orders', data),
    getMyOrders: () => api.get('/api/orders/my-orders'),
    getById: (id) => api.get(`/api/orders/${id}`),
    getAll: () => api.get('/api/orders'),
};

export default api;
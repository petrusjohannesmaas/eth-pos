import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const authService = {
    login: async (accessCode: string) => {
        const response = await api.post('/auth/access-code', { accessCode });
        return response.data;
    },
};

export const productService = {
    getAll: async () => {
        const response = await api.get('/products');
        return response.data;
    },
    getByBarcode: async (barcode: string) => {
        const response = await api.get(`/products/barcode/${barcode}`);
        return response.data;
    },
    create: async (data: { name: string; barcode: string; price: number }) => {
        const response = await api.post('/products', data);
        return response.data;
    },
};

export const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    create: async (data: { name: string; accessCode: string; role: string }) => {
        const response = await api.post('/users', data);
        return response.data;
    },
};

export const transactionService = {
    getAll: async () => {
        const response = await api.get('/transactions');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/transactions', data);
        return response.data;
    },
};

export default api;

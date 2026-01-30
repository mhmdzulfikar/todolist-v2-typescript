import api from './api';

// Definisiin Tipe Data biar enak (Opsional tapi Recommended)
interface LoginDTO {
    email: string;
    password: string;
}

export const authService = {
    register: async (userData: any) => { // Ganti any dengan interface User kalau sempet
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials: LoginDTO) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/getMe');
        return response.data;
    }
};
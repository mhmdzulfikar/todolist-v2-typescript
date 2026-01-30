import api from './api';

export const cardService = {
    getAll: async () => {
        const response = await api.get('/cards');
        return response.data;
    },

    create: async (cardData: any) => {
        const response = await api.post('/cards', cardData);
        return response.data;
    },

    updateStatus: async (id: number, status: 'progress' | 'future') => {
        const response = await api.put(`/cards/${id}`, { status });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/cards/${id}`);
        return response.data;
    }
};
import api from './api';

export const notificationService = {
    createBroadcast: async (data: any ) => {
        const response = await api.post('/notificationsPopup', data);
        return response.data;
    },

    getNotifications: async () => {
        const response = await api.get('/notificationsPopus');
        return response.data;
    }
}
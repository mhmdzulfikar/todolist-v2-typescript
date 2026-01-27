// src/services/todoService.ts
import api from './api'; // Import instance axios lo yang lama
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo';

export const todoService = {
    getAll: async (): Promise<Todo[]> => {
        const response = await api.get('/todos');
        return response.data;
    },

    create: async (data: CreateTodoDTO): Promise<Todo> => {
        const response = await api.post('/todos', data);
        return response.data;
    },

    // Kita gabung toggle & edit jadi satu fungsi update biar efisien
    update: async (id: number, data: UpdateTodoDTO): Promise<Todo> => {
        const response = await api.put(`/todos/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/todos/${id}`);
    }
};
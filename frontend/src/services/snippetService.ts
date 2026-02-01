import api from './api';
import { Snippet, SnippetInput, SnippetUpdate } from '../types/snippet';

export const snippetService = {
  // Ambil semua -> Balikannya Array of Snippet
  getAll: async (): Promise<Snippet[]> => {
    const response = await api.get('/snippets');
    return response.data;
  },

  // Create -> Kirimnya SnippetInput (Tanpa ID)
  create: async (data: SnippetInput): Promise<Snippet> => {
    const response = await api.post('/snippets', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/snippets/${id}`);
  },

  // Update -> Kirimnya SnippetUpdate
  update: async (id: number, data: SnippetUpdate): Promise<Snippet> => {
    const response = await api.put(`/snippets/${id}`, data);
    return response.data;
  }
};
import api from './api';

// Kita definisiin dulu data yang mau dikirim itu bentuknya gimana
export interface SnippetDTO {
  title: string;
  language: string;
  code: string;
}

export const snippetService = {
  // Return Promise<SnippetItem[]> biar frontend tau dia bakal dapet array
  getAll: async () => {
    const response = await api.get('/snippets');
    return response.data;
  },

  create: async (data: SnippetDTO) => {
    const response = await api.post('/snippets', data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/snippets/${id}`);
    return response.data;
  },

  // Data disini bisa partial (cuma title doang, atau code doang)
  update: async (id: number, data: Partial<SnippetDTO>) => {
    const response = await api.put(`/snippets/${id}`, data);
    return response.data;
  }
};
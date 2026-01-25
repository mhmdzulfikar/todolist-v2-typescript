import axios from 'axios';

// 1. Buat Instance Axios
const api = axios.create({
  baseURL: 'http://localhost:5000', 
  withCredentials: true,
  headers: {
    "Content-Type" : "application/json"
  }
});

// 🔥 2. PASANG INTERCEPTOR (SATPAM OTOMATIS)
// Kode ini akan jalan DULUAN sebelum request dikirim ke backend
api.interceptors.request.use(
  (config) => {
    // Ambil token dari saku browser
    const token = localStorage.getItem('token');
    
    // Kalau ada token, tempelkan ke Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- TODO API ---

export const getTodos = async () => {
  const response = await api.get('/todos'); 
  return response.data;
};

export const addTodo = async (task) => {
  const response = await api.post('/todos', { task }); 
  return response.data;
};

export const updateTodo = async (id, completed) => {
  const response = await api.put(`/todos/${id}`, { completed });
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

// --- AUTH API ---

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

// --- NOTIFICATION API ---

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const createBroadcast = async (data) => {
  const response = await api.post('/notifications', data);
  return response.data;
};

export const getCards = async () => {
  const response = await api.get('/cards');
  return response.data;
};

export const createCard = async (cardData) => {
  const response = await api.post('/cards', cardData);
  return response.data;
};

export const updateCardStatus = async (id, status) => {
  // status: 'progress' atau 'future'
  const response = await api.put(`/cards/${id}`, { status });
  return response.data;
};

// --- NOTE API ---
export const getNote = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const updateNote = async (data) => {
  const response = await api.put('/notes', data);
  return response.data;
};

// AUTH
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// 🔥🔥 INI YANG TADI KURANG (WAJIB ADA) 🔥🔥
export const deleteCard = async (id) => {
  const response = await api.delete(`/cards/${id}`);
  return response.data;
};

// --- SNIPPET API ---
export const getSnippets = async () => {
  const response = await api.get('/snippets');
  return response.data;
};

export const createSnippet = async (data) => {
  const response = await api.post('/snippets', data);
  return response.data;
};

export const deleteSnippet = async (id) => {
  const response = await api.delete(`/snippets/${id}`);
  return response.data;
};

export const updateSnippet = async (id, data) => {
  // Pake method PUT sesuai backend lo
  const response = await api.put(`/snippets/${id}`, data);
  return response.data;
};

export default api;
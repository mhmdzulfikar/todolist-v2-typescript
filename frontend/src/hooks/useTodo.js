import { useEffect, useState } from "react";
// Import API Services
import { getTodos, addTodo, updateTodo, deleteTodo } from "../services/api";

export default function useTodo() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. LOAD DATA AWAL
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // Panggil API (Backend udah otomatis reset tanggal, jadi aman)
        const data = await getTodos(); 
        setTasks(data);
      } catch (err) {
        console.error("Gagal load data", err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // 2. FUNGSI ADD
  const addTask = async (text) => {
    try {
        const newTask = await addTodo(text);
        setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
        console.error(err);
    }
  };

  // 3. FUNGSI TOGGLE
  const toggleTask = async (id, currentStatus) => {
    try {
        // Optimistic UI: Update layar duluan biar cepet
        setTasks((prev) => prev.map((t) => 
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
        
        // Baru kirim ke Backend
        await updateTodo(id, !currentStatus);
    } catch (err) {
        console.error(err);
        // Kalau error, balikin lagi statusnya (Rollback - Opsional)
    }
  };

  // 4. FUNGSI EDIT (Code Baru)
  const editTask = async (id, newText) => {
    try {
        // A. Optimistic Update (Layar berubah duluan)
        setTasks((prev) => prev.map((t) => 
            // Cari ID-nya, ganti properti 'task' dengan teks baru
            t.id === id ? { ...t, task: newText } : t
        ));

        // B. Kirim ke Backend
        // Kita pake fungsi updateTodo yang sama, tapi isinya beda
        await updateTodo(id, { task: newText }); 
    } catch (err) {
        console.error("Gagal edit:", err);
    }
  };

  // 4. FUNGSI REMOVE
  const removeTask = async (id) => {
    try {
        await deleteTodo(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
        console.error(err);
    }
  };

  // Kembalikan "Alat-alat" ini ke TodoList.jsx
  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    removeTask,
    editTask,
  };
}
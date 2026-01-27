// src/hooks/useTodos.ts
import { useState, useEffect, useCallback } from 'react';
import { todoService } from '../services/todoService';
import { Todo } from '../types/todo';

export const useTodos = () => {
    const [tasks, setTasks] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch Data
    const fetchTodos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await todoService.getAll();
            setTasks(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Load pas pertama buka
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // 2. Add Task
    const addTask = async (text: string) => {
        try {
            const newTask = await todoService.create({ task: text });
            // Update state lokal biar gak perlu fetch ulang (Hemat kuota)
            setTasks((prev) => [newTask, ...prev]); 
        } catch (err) {
            console.error(err);
            alert("Gagal menambah tugas");
        }
    };

    // 3. Toggle Complete
    const toggleTask = async (id: number, currentStatus: boolean) => {
        // Optimistic UI (Ubah dulu di layar biar cepet)
        setTasks((prev) => prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
        
        try {
            await todoService.update(id, { completed: !currentStatus });
        } catch (err) {
            // Kalau gagal, balikin lagi (Rollback)
            setTasks((prev) => prev.map(t => t.id === id ? { ...t, completed: currentStatus } : t));
            console.error(err);
        }
    };

    // 4. Edit Text
    const editTask = async (id: number, newText: string) => {
        // Optimistic UI
        setTasks((prev) => prev.map(t => t.id === id ? { ...t, task: newText } : t));

        try {
            await todoService.update(id, { task: newText });
        } catch (err) {
            console.error(err);
        }
    };

    // 5. Delete
    const removeTask = async (id: number) => {
        try {
            await todoService.delete(id);
            setTasks((prev) => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return { tasks, loading, error, addTask, toggleTask, editTask, removeTask };
};
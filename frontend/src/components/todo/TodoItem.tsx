import React, { useState } from "react";
import { FaTrash, FaCheck, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { Todo } from "../../types/todo";

// 1. DEFINISI PROPS (KONTRAK DATA)
// Ini adalah "Syarat Masuk" buat component TodoItem.
// Parent (TodoList) WAJIB ngirim fungsi-fungsi ini. Kalau lupa, TypeScript bakal teriak merah.
interface TodoItemProps {
    task: Todo;                                          // Data tugasnya
    toggleComplete: (id: number, status: boolean) => void; // Fungsi toggle dari Hook -> TodoList -> Sini
    deleteTask: (id: number) => void;                    // Fungsi hapus
    editTask: (id: number, text: string) => void;        // Fungsi edit
}

// 2. COMPONENT DEFINITION
// React.FC<TodoItemProps> artinya: "Ini Component React yang props-nya HARUS sesuai TodoItemProps"
const TodoItem: React.FC<TodoItemProps> = ({ task, toggleComplete, deleteTask, editTask }) => {
    
    // 3. LOCAL STATE (UI Logic)
    // State ini CUKUP di sini aja, gak perlu ditaruh di Hook useTodos.
    // Kenapa? Karena 'lagi ngedit atau enggak' itu urusan privasi component ini, component lain gak perlu tau.
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(task.task); // Default value ambil dari props

    // Handler Simpan Edit
    const handleSave = () => {
        if (newText.trim()) {
            editTask(task.id, newText); // Lapor ke Parent: "Woy, data ID sekian berubah nih!"
            setIsEditing(false);        // Tutup mode edit
        }
    };

    // Handler Batal Edit
    const handleCancel = () => {
        setNewText(task.task); // Reset teks ke aslinya
        setIsEditing(false);   // Tutup mode edit
    };

    return (
        <div className={`group flex items-center justify-between p-4 mb-3 bg-white rounded-2xl border transition-all duration-300 hover:shadow-md ${task.completed ? "bg-gray-50 opacity-75" : "hover:border-indigo-200"}`}>
            
            {/* 4. CONDITIONAL RENDERING (Ternary Operator) */}
            {/* Logic: Kalau isEditing TRUE -> Tampilkan Form Input. Kalau FALSE -> Tampilkan Teks Biasa. */}
            {isEditing ? (
                // --- A. MODE EDIT (Form Input) ---
                <div className="flex items-center gap-2 flex-1 w-full animate-fade-in">
                    <input 
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="flex-1 bg-gray-50 border border-indigo-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        autoFocus // UX: Pas klik edit, kursor langsung aktif di sini
                    />
                    <button onClick={handleSave} className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><FaSave /></button>
                    <button onClick={handleCancel} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FaTimes /></button>
                </div>
            ) : (
                // --- B. MODE NORMAL (Tampilan List) ---
                <>
                    {/* Area Klik Toggle (Kiri) */}
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleComplete(task.id, task.completed)}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? "bg-indigo-500 border-indigo-500 text-white" : "border-gray-300"}`}>
                            {task.completed && <FaCheck size={10} />}
                        </div>
                        <span className={`font-medium text-lg ${task.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                            {task.task}
                        </span>
                    </div>

                    {/* Area Tombol Aksi (Kanan) - Muncul pas di-hover (group-hover) */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg">
                            <FaEdit size={16} />
                        </button>
                        
                        {/* 5. STOP PROPAGATION (PENTING!) */}
                        {/* e.stopPropagation() mencegah event 'bocor' ke atas. */}
                        {/* Tanpa ini: Klik tombol hapus -> Task ikut ke-toggle (selesai/belum). Bahaya! */}
                        <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
                            <FaTrash size={16} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TodoItem;
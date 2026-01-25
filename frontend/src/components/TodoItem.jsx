import React, { useState} from "react";
import { FaTrash, FaCheck, FaEdit } from "react-icons/fa";

const TodoItem = ({ task, toggleComplete, editTask, deleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.task);

  // Logic tombol Edit Ditekan
  const handleEditClick = (e) => {
    e.stopPropagation(); // Biar gak kepanggil toggle
    setIsEditing(true);
  };

  // Logic Simpan Edit
  const handleSave = (e) => {
    e.stopPropagation();
    if (newText.trim()) {
      editTask(task.id, newText); // Kirim ID dan Teks Baru ke TodoList
      setIsEditing(false); // Keluar mode edit
    }
  };

  // Logic Tombol Cencel ditekan
  const handleCancel = (e) => {
    e.stopPropagation();
    setNewText(task.task); // Balikin teks ke semula
    setIsEditing(false);
  };

  return (
    <div 
      className={`group flex items-center justify-between p-4 mb-3 bg-white rounded-2xl border transition-all duration-300 hover:shadow-md
      ${task.completed ? "border-gray-100 bg-gray-50/50" : "border-gray-100 hover:border-indigo-200"}`}
    >
      
      {/* --- LOGIC TAMPILAN (CONDITIONAL RENDERING) --- */}
      
      {isEditing ? (
        // A. KALAU LAGI MODE EDIT (Muncul Input)
        <div className="flex items-center gap-2 flex-1 w-full animate-fade-in">
            <input 
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="flex-1 bg-gray-50 border border-indigo-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                autoFocus
                onClick={(e) => e.stopPropagation()} 
            />
            {/* Tombol Save */}
            <button onClick={handleSave} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Save">
                <FaSave size={16} />
            </button>
            {/* Tombol Cancel */}
            <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                <FaTimes size={16} />
            </button>
        </div>

      ) : (
        // B. KALAU MODE BIASA (Muncul Teks & Checkbox)
        <>
          {/* BAGIAN KIRI: Checkbox & Teks */}
          <div 
            className="flex items-center gap-4 flex-1 cursor-pointer" 
            onClick={() => toggleComplete(task.id)}
          >
            {/* Custom Checkbox */}
            <div 
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300
              ${task.completed 
                 ? "bg-indigo-500 border-indigo-500 text-white" 
                 : "border-gray-300 text-transparent group-hover:border-indigo-400"}`}
            >
              <FaCheck size={10} />
            </div>

            {/* Teks Task */}
            <span 
              className={`font-medium text-lg transition-all duration-300
              ${task.completed 
                 ? "text-gray-400 line-through decoration-gray-300" 
                 : "text-gray-700"}`}
            >
              {task.task} 
            </span>
          </div>

          {/* BAGIAN KANAN: Tombol-Tombol */}
          <div className="flex items-center gap-1">
             {/* Tombol EDIT (Baru) */}
             <button
                onClick={handleEditClick}
                className="p-2 text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Edit Task"
             >
                <FaEdit size={16} />
             </button>

             {/* Tombol HAPUS */}
             <button 
                onClick={(e) => {
                   e.stopPropagation();
                   deleteTask(task.id);
                }} 
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete Task"
             >
                <FaTrash size={16} />
             </button>
          </div>
        </>
      )}

    </div>
  );
};

export default TodoItem;
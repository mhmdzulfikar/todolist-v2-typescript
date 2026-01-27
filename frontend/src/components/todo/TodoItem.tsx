// src/components/todo/TodoItem.tsx
import React, { useState } from "react";
import { FaTrash, FaCheck, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { Todo } from "../../types/todo";

// Definisi Props Component
interface TodoItemProps {
    task: Todo;
    toggleComplete: (id: number, status: boolean) => void;
    deleteTask: (id: number) => void;
    editTask: (id: number, text: string) => void;
}

// React.FC = Functional Component
const TodoItem: React.FC<TodoItemProps> = ({ task, toggleComplete, deleteTask, editTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(task.task);

    const handleSave = () => {
        if (newText.trim()) {
            editTask(task.id, newText);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setNewText(task.task);
        setIsEditing(false);
    };

    return (
        <div className={`group flex items-center justify-between p-4 mb-3 bg-white rounded-2xl border transition-all duration-300 hover:shadow-md ${task.completed ? "bg-gray-50 opacity-75" : "hover:border-indigo-200"}`}>
            
            {isEditing ? (
                // MODE EDIT
                <div className="flex items-center gap-2 flex-1 w-full animate-fade-in">
                    <input 
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="flex-1 bg-gray-50 border border-indigo-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        autoFocus
                    />
                    <button onClick={handleSave} className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><FaSave /></button>
                    <button onClick={handleCancel} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FaTimes /></button>
                </div>
            ) : (
                // MODE NORMAL
                <>
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleComplete(task.id, task.completed)}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? "bg-indigo-500 border-indigo-500 text-white" : "border-gray-300"}`}>
                            {task.completed && <FaCheck size={10} />}
                        </div>
                        <span className={`font-medium text-lg ${task.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                            {task.task}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg">
                            <FaEdit size={16} />
                        </button>
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
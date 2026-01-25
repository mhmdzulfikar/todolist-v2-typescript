import React, { useState } from "react";
import TodoList from "../components/TodoList";
import NotePad from "../components/NotePad"; // Pastikan file ini ada, kalau error comment dulu
import { FaTasks, FaStickyNote } from "react-icons/fa";

const Todo = () => {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* --- CUSTOM TAB NAVIGATION --- */}
        <div className="flex justify-center mb-8">
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 inline-flex gap-2">
                
                {/* Tab: Tasks */}
                <button 
                    onClick={() => setActiveTab("tasks")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                    ${activeTab === "tasks" 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                    <FaTasks /> Tasks
                </button>

                {/* Tab: Notes */}
                <button 
                    onClick={() => setActiveTab("notes")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                    ${activeTab === "notes" 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                    <FaStickyNote /> Notes
                </button>
            </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="animate-fade-in-up">
            {activeTab === "tasks" ? (
                <TodoList />
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-1 min-h-[600px]">
                    {/* NotePad Component */}
                    <NotePad />
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Todo;
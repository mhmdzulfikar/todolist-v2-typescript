// src/pages/TodoPage.tsx
import React, { useState } from "react";
import TodoList from "../components/todo/TodoList";
// import NotePad from "../components/NotePad"; // Aktifin kalau NotePad udah ada
import { FaTasks, FaStickyNote } from "react-icons/fa";

const TodoPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"tasks" | "notes">("tasks");

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* TAB NAVIGATION */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 inline-flex gap-2">
                        <button
                            onClick={() => setActiveTab("tasks")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "tasks" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <FaTasks /> Tasks
                        </button>
                        <button
                            onClick={() => setActiveTab("notes")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "notes" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <FaStickyNote /> Notes
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="animate-fade-in-up">
                    {activeTab === "tasks" ? (
                        <TodoList />
                    ) : (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[600px] flex items-center justify-center text-gray-400">
                            {/* <NotePad /> */}
                            <p>NotePad Component coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoPage;
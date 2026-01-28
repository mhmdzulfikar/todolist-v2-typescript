import React, { useState } from "react";
// Import Icon biar cantik
import { FaPlus, FaCalendarAlt, FaChartPie } from "react-icons/fa";

// 🔥 IMPORT HOOK: Ini "Otak" kita. Logic fetch/add/delete ada di sini semua.
// UI gak perlu tau cara fetch API, taunya cuma "panggil fungsi".
import { useTodos } from "../../hooks/useTodos"; 

// Import Child Component (Tampilan per item)
import TodoItem from "./TodoItem";

const TodoList: React.FC = () => {
    // 1. PANGGIL HOOK (Separation of Concerns)
    // Component ini cuma minta data (tasks) dan alat (addTask, etc).
    // Urusan loading, error, dan axios diurus sama Hook.
    const { tasks, loading, addTask, toggleTask, editTask, removeTask } = useTodos();
    
    // 2. UI STATE (State Tampilan)
    // Ini state yang cuma dipake di file ini. Gak perlu masuk Hook.
    const [inputText, setInputText] = useState("");
    
    // TypeScript Union Type: Filter cuma boleh diisi 3 string ini. Typo dikit langsung merah.
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

    // 3. DERIVED STATE (State Turunan) - ✅ CARA PRO
    // Kita GAK PAKE useState/useEffect buat filter data.
    // Kita hitung langsung saat render. Ini menjamin data SELALU SINKRON.
    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "active") return !task.completed;
        return true;
    });

    // Statistik sederhana (juga dihitung on-the-fly)
    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
    
    // Handler Form Submit
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault(); // Biar gak reload halaman
        if (!inputText.trim()) return; // Validasi kosong
        
        addTask(inputText); // Panggil fungsi dari Hook
        setInputText("");   // Reset input
    };

    return (
        <div className="w-full max-w-3xl mx-auto pb-10">
            
            {/* --- BAGIAN 1: HEADER & STATS --- */}
            <div className="mb-8 bg-linear-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 opacity-80 text-sm mb-1">
                            <FaCalendarAlt /> <span>Today's Overview</span>
                        </div>
                        <h2 className="text-3xl font-bold">Today's Focus</h2>
                        <p className="opacity-90 mt-2">
                            Completed {completedCount} of {tasks.length} tasks.
                        </p>
                    </div>
                    <FaChartPie className="text-6xl opacity-20 hidden md:block" />
                </div>
                {/* Visual Progress Bar */}
                <div className="mt-6 bg-black/20 h-2 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-white transition-all duration-1000 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* --- BAGIAN 2: INPUT FORM --- */}
            <form onSubmit={handleAdd} className="relative mb-8 group">
                <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full pl-6 pr-16 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-700 placeholder:text-gray-400 shadow-sm"
                />
                <button 
                    type="submit" 
                    disabled={!inputText.trim()} 
                    className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white w-12 rounded-xl flex items-center justify-center transition-colors shadow-md"
                >
                    <FaPlus />
                </button>
            </form>

            {/* --- BAGIAN 3: FILTER TABS --- */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100/50 rounded-xl w-fit">
                {/* Kita looping array statis biar kodenya pendek & rapi */}
                {(["all", "active", "completed"] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200
                            ${filter === type 
                                ? "bg-white text-indigo-600 shadow-sm" 
                                : "text-gray-500 hover:text-gray-700"}`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* --- BAGIAN 4: TASK LIST --- */}
            <div className="space-y-1 min-h-[200px]">
                {loading ? (
                    // State Loading (Skeleton UI sederhana)
                    <p className="text-center text-gray-400 py-10 animate-pulse">Loading tasks...</p>
                ) : filteredTasks.length > 0 ? (
                    // Mapping Data ke Component TodoItem
                    filteredTasks.map((task) => (
                        <TodoItem
                            key={task.id}
                            task={task}
                            toggleComplete={toggleTask} // Oper fungsi dari Hook
                            deleteTask={removeTask}     // Oper fungsi dari Hook
                            editTask={editTask}         // Oper fungsi dari Hook
                        />
                    ))
                ) : (
                    // State Kosong (Empty State)
                    <div className="text-center py-10 opacity-50">
                        <p className="text-gray-400">No {filter === 'all' ? '' : filter} tasks found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList;
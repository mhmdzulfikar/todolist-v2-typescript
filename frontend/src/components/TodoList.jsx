import { useState } from "react";
import { FaPlus, FaCalendarAlt, FaChartPie } from "react-icons/fa";
import TodoItem from "./TodoItem";
import useTodo from "../hooks/useTodo";

const TodoList = () => {
  const { tasks, addTask, toggleTask, editTask, removeTask, loading } = useTodo();
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("all");

  // Safety Check: Pastikan tasks selalu array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Logic Filter
  const filteredTasks = safeTasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  // Statistik
  const completedCount = safeTasks.filter(t => t.completed).length;
  const totalCount = safeTasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Tanggal Hari Ini
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long"
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addTask(inputText);
    setInputText("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      
      {/* HEADER: Date & Progress */}
      <div className="mb-8 bg-linear-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 opacity-80 text-sm font-medium mb-1">
                    <FaCalendarAlt /> <span>{today}</span>
                </div>
                <h2 className="text-3xl font-bold">Today's Focus</h2>
                <p className="opacity-90 mt-2 text-indigo-100">
                   You have completed {completedCount} of {totalCount} tasks.
                </p>
            </div>
            <div className="hidden md:block">
                 {/* Pie Chart Icon Visual */}
                 <FaChartPie className="text-6xl opacity-20" />
            </div>
        </div>
        
        {/* Progress Bar Visual */}
        <div className="mt-6 bg-black/20 h-2 rounded-full overflow-hidden">
            <div 
                className="h-full bg-white transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>

      {/* INPUT FORM */}
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

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100/50 rounded-xl w-fit">
        {["all", "active", "completed"].map((type) => (
          <button 
            key={type} 
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all
                ${filter === type 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* LIST ITEMS */}
      <div className="space-y-1 min-h-[200px]">
        {loading ? (
            <p className="text-center text-gray-400 py-10 animate-pulse">Loading tasks...</p>
        ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
            <TodoItem
                key={task.id}
                task={task}
                toggleComplete={() => toggleTask(task.id, task.completed)}
                deleteTask={() => removeTask(task.id)}
                editTask={editTask}
            />
            ))
        ) : (
            <div className="text-center py-10 opacity-50">
                <p className="text-gray-400">No {filter} tasks found.</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default TodoList;
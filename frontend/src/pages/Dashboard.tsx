// src/pages/Dashboard.tsx

import React, { useState } from "react";
import { FaBullhorn, FaClipboardList, FaClock, FaCheckCircle, FaChartLine, FaTrash } from "react-icons/fa";
import { useTodos } from "../hooks/useTodos";
import { notificationService } from "../services/notificationService"; 
import ProductivityChart from "../components/ProductivityChart";
import TodoInput from "../pages/TodoInput"; 

const Dashboard: React.FC = () => {

  const { tasks, loading, addTask, removeTask  } = useTodos();

  const [newTask, setNewTask] = useState("");
  const [inputLoading, setInputLoading] = useState(false);

  // State Admin
  const [isAdmin] = useState<boolean>(() => localStorage.getItem("role") === "admin");
  const [broadcastMsg, setBroadcastMsg] = useState({ title: "", message: "" });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  const handleAddTodo = async () => {
    if (!newTask.trim()) return;
    setInputLoading(true);
    await addTask(newTask);
    setNewTask(""); 
    setInputLoading(false);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.message) return alert("Isi pesan dulu dong!");

    try {
      await notificationService.createBroadcast({
        title: broadcastMsg.title || "Info Admin",
        message: broadcastMsg.message,
      });

      alert("Notifikasi berhasil dikirim! 🚀");
      setBroadcastMsg({ title: "", message: "" });
    } catch (error) {
      console.error("Gagal broadcast:", error);
      alert("Gagal kirim notifikasi.");
    }
  };

  return (
    <div className="font-sans pb-20 min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 px-6 pt-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your tasks.</p>
        </div>
        <div className="text-sm text-gray-400 font-medium bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
          📅 {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      <div className="px-6">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><FaClipboardList className="text-2xl" /></div>
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Tasks</h3>
              <p className="text-3xl font-extrabold text-gray-800 mt-1">{loading ? "..." : total}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-orange-50 rounded-2xl text-orange-500"><FaClock className="text-2xl" /></div>
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">In Progress</h3>
              <p className="text-3xl font-extrabold text-gray-800 mt-1">{loading ? "..." : pending}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-green-50 rounded-2xl text-green-500"><FaCheckCircle className="text-2xl" /></div>
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Completed</h3>
              <p className="text-3xl font-extrabold text-gray-800 mt-1">{loading ? "..." : completed}</p>
            </div>
          </div>
        </div>

        {/* INPUT & CHART SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add Quick Task</h2>
              <TodoInput 
                value={newTask} 
                onChange={setNewTask} 
                onAdd={handleAddTodo} 
                loading={inputLoading}
              />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Latest Tasks</h2>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p>No tasks available.</p>
                  </div>
                ) : (
                  tasks.slice(0, 5).map((todo) => (
                    <div key={todo.id} className="group bg-gray-50 hover:bg-white p-4 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-md transition-all flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${todo.completed ? "bg-green-500" : "bg-orange-400"}`}></div>
                        <span className={`font-medium ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                          {todo.task}
                        </span>
                      </div>
                      <button
                        // ✅ FIX 2 (Usage): Panggil deleteTask
                        onClick={() => {
                           if(window.confirm("Delete?")) removeTask(todo.id)
                        }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )}
                {tasks.length > 5 && (
                    <p className="text-center text-sm text-indigo-500 mt-4 cursor-pointer">View all tasks in To-Do Menu</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-sm"><FaChartLine /></span>
                  Analytics
                </h2>
              </div>
              <div className="w-full h-[300px]">
                <ProductivityChart />
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="relative overflow-hidden bg-linear-to-r from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-xl text-white mb-8">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm border border-white/10">
                  <FaBullhorn className="text-yellow-300" /> Admin Only
                </div>
                <h2 className="text-2xl font-bold mb-2">Broadcast</h2>
                <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                  Kirim notifikasi ke semua user.
                </p>
              </div>

              <form onSubmit={handleBroadcast} className="md:w-2/3 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Judul"
                  className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:bg-white/20"
                  value={broadcastMsg.title}
                  onChange={(e) => setBroadcastMsg({ ...broadcastMsg, title: e.target.value })}
                />
                <textarea
                  placeholder="Pesan..."
                  className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:bg-white/20 h-24 resize-none"
                  value={broadcastMsg.message}
                  onChange={(e) => setBroadcastMsg({ ...broadcastMsg, message: e.target.value })}
                ></textarea>
                <div className="flex justify-end">
                  <button type="submit" className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 shadow-lg">
                    Kirim 🚀
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
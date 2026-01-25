import React, { useEffect, useState } from "react";
// Import Icon (Saya lengkapi ikon untuk Stats)
import { FaBullhorn, FaClipboardList, FaClock, FaCheckCircle, FaChartLine } from "react-icons/fa"; 
// Import API
import { getTodos, createBroadcast } from "../services/api"; 
// Import Grafik
import ProductivityChart from "../components/ProductivityChart";

const Dashboard = () => {
  // --- STATE DASHBOARD (LOGIC TETAP) ---
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  // --- STATE ADMIN (LOGIC TETAP) ---
  const [isAdmin] = useState(() => localStorage.getItem("role") === "admin");
  const [broadcastMsg, setBroadcastMsg] = useState({ title: "", message: "" });

  // --- LOAD DATA (LOGIC TETAP) ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const todos = await getTodos(); 
        
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const pending = total - completed;

        setStats({ total, pending, completed });
      } catch (error) {
        console.error("Gagal load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // --- LOGIC KIRIM PESAN ADMIN (LOGIC TETAP) ---
  const handleBroadcast = async (e) => {
    e.preventDefault(); // Mencegah reload form
    if (!broadcastMsg.message) return alert("Isi pesan dulu dong!");

    try {
        await createBroadcast({
            title: broadcastMsg.title || "Info Admin", // Kirim title juga biar rapi
            message: broadcastMsg.message 
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
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your tasks.</p>
        </div>
        <div className="text-sm text-gray-400 font-medium bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
             <FaClipboardList className="text-2xl" />
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Tasks</h3>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">
               {loading ? "..." : stats.total}
            </p>
          </div>
        </div>
        
        {/* Card 2: Pending */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(249,115,22,0.1)] border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="p-4 bg-orange-50 rounded-2xl text-orange-500">
             <FaClock className="text-2xl" />
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">In Progress</h3>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">
               {loading ? "..." : stats.pending}
            </p>
          </div>
        </div>
        
        {/* Card 3: Completed */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(34,197,94,0.1)] border border-gray-100 flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300">
          <div className="p-4 bg-green-50 rounded-2xl text-green-500">
             <FaCheckCircle className="text-2xl" />
          </div>
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Completed</h3>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">
               {loading ? "..." : stats.completed}
            </p>
          </div>
        </div>
      </div>

      {/* --- CHART SECTION (DIBUNGKUS BIAR RAPI) --- */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
         <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-sm"><FaChartLine /></span>
                    Productivity Analytics
                </h2>
                <p className="text-gray-400 text-sm mt-1">Monitor your daily task completion trend.</p>
            </div>
         </div>
         
         {/* Container Grafik */}
         <div className="w-full h-[350px] md:h-[400px]">
            <ProductivityChart />
         </div>
      </div>

      {/* --- 🔥 ADMIN BROADCAST PANEL (UI MODERN) --- */}
      {isAdmin && (
        <div className="relative overflow-hidden bg-linear-to-r from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-xl text-white">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                {/* Text Side */}
                <div className="md:w-1/3">
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm border border-white/10">
                        <FaBullhorn className="text-yellow-300" /> Admin Only
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Broadcast Announcement</h2>
                    <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                        Kirim notifikasi ke semua user yang terdaftar. Pesan ini akan muncul di panel notifikasi mereka.
                    </p>
                </div>

                {/* Form Side */}
                <form onSubmit={handleBroadcast} className="md:w-2/3 flex flex-col gap-4">
                    <input 
                        type="text" 
                        placeholder="Judul Pengumuman (Opsional)"
                        className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all backdrop-blur-sm"
                        value={broadcastMsg.title}
                        onChange={(e) => setBroadcastMsg({...broadcastMsg, title: e.target.value})}
                    />
                    
                    <div className="relative">
                        <textarea 
                            placeholder="Tulis pesan untuk semua user..."
                            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all backdrop-blur-sm h-28 resize-none"
                            value={broadcastMsg.message}
                            onChange={(e) => setBroadcastMsg({...broadcastMsg, message: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            Kirim Notifikasi 🚀
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
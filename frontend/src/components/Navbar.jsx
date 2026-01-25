import React, { useState, useEffect } from "react";
import { FaSearch, FaBell, FaSignOutAlt, FaStar, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CardNavPage from "../pages/CardNavPage"; 
import NotificationPopup from "./NotificationPopup";
// Import API getMe
import { getMe } from "../services/api"; 

const Navbar = () => {
  // Default data user
  const [userData, setUserData] = useState({ 
    name: localStorage.getItem("name") || "User", 
    xp: 0, 
    level: 1 
  });
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  // 🔥 SOLUSI ANTI ERROR: Logic Fetch ada DI DALAM useEffect
  useEffect(() => {
    
    const fetchUserData = async () => {
      try {
        // Cek token dulu
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await getMe();
        
        // Update State
        setUserData({
          name: data.name,
          xp: data.xp || 0,
          level: data.level || 1
        });

        // Sync local storage
        localStorage.setItem("name", data.name);
        if (data.role) localStorage.setItem("role", data.role);

      } catch (error) {
        console.error("Gagal update data user", error);
      }
    };

    // 1. Jalanin saat pertama kali
    fetchUserData();

    // 2. Jalanin setiap 5 detik (Biar XP nambah real-time)
    const interval = setInterval(fetchUserData, 5000);
    
    // 3. Bersihkan interval saat pindah halaman
    return () => clearInterval(interval);
    
  }, []); // <--- Dependency Kosong (Aman dari Loop)

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login");
    }
  };

  // Hitung % Progress Bar
  const xpProgress = userData.xp % 100; 

  return (
    <nav className="sticky top-0 z-50 w-full h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      
      {/* KIRI */}
      <div className="flex items-center gap-4">
        <div className="relative w-[60px] h-[60px] flex items-center justify-center min-[766px]:hidden">
             <CardNavPage />
        </div>
        <div className="text-2xl font-bold  from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hidden md:block">
          MyApp
        </div>
      </div>

      {/* KANAN */}
      <div className="flex items-center gap-6">
        
        {/* GAMIFICATION BAR */}
        <div className="hidden md:flex flex-col items-end mr-2">
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-900 mb-1">
                <span className="bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <FaStar size={10} /> LVL {userData.level}
                </span>
                <span className="text-gray-500 text-[10px] font-semibold">{userData.xp} XP</span>
            </div>
            {/* Progress Bar */}
            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div 
                    className="h-full from-yellow-400 to-orange-500 transition-all duration-1000 ease-out"
                    style={{ width: `${xpProgress}%` }}
                ></div>
            </div>
        </div>

        {/* Notif */}
        <div className="relative">
            <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)} 
                className={`relative p-2 rounded-full transition-colors ${isNotifOpen ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-100"}`}
            >
                <FaBell />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            {isNotifOpen && <NotificationPopup />}
        </div>

        {/* Profile */}
        <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold shadow-md select-none border-2 border-indigo-500 cursor-pointer hover:scale-105 transition-transform"
            >
                {userData.name.charAt(0).toUpperCase()}
            </div>

            {isProfileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{userData.name}</p>
                        <p className="text-xs text-indigo-600 font-semibold mt-1">Level {userData.level}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
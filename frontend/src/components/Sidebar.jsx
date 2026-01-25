import React from "react";
import { Link, useLocation } from "react-router-dom"; 
import { FaHome, FaChartPie, FaTasks, FaSignOutAlt, FaCode } from "react-icons/fa";
// 🔥 1. Import Pomodoro
import Pomodoro from "./Pomodoro"; 

const Sidebar = () => {
  const location = useLocation(); 

  const menus = [
    { name: "Home", path: "/home", icon: <FaHome /> },
    { name: "Dashboard", path: "/dashboard", icon: <FaChartPie /> },
    { name: "My Workspace", path: "/todo", icon: <FaTasks /> },
    { name: "Code Library", path: "/snippets", icon: <FaCode /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 min-h-screen p-4 hidden md:flex flex-col transition-colors duration-300">
      
      {/* Logo Area (Sama kayak sebelumnya) */}
      <div className="flex items-center gap-3 mb-10 px-2 mt-2">
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <FaCode /> 
        </div>
        <h1 className="text-xl font-bold tracking-wider text-gray-800 dark:text-white">DevBoard</h1>
      </div>

      {/* Menu Items (Sama kayak sebelumnya) */}
      <nav className="space-y-1 flex-1">
        {menus.map((menu, index) => {
          const isActive = location.pathname === menu.path;
          return (
            <Link 
              to={menu.path} 
              key={index}
              className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200 group
                ${isActive 
                  ? "bg-indigo-50 dark:bg-[#2d2d2d] text-indigo-600 dark:text-white border-l-4 border-indigo-500" 
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                {menu.icon}
              </span>
              <span className="font-medium text-sm">{menu.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 🔥 2. Widget Pomodoro (Di atas Logout) */}
      <div className="mb-6">
         <Pomodoro />
      </div>

      {/* Logout Area */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
        <Link to="/login"> 
            <button className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-[#2d2d2d] w-full rounded-md transition-all group">
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Logout</span>
            </button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
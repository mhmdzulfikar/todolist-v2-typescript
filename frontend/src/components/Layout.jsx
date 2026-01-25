import React from "react";
import { Outlet } from "react-router-dom"; // Outlet itu tempat ganti-ganti halaman
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    // Container Utama: Full Screen & Gak boleh scroll window (overflow-hidden)
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. Sidebar (Kiri - Tetap/Fixed) */}
      <Sidebar />

      {/* 2. Wrapper Kanan (Navbar + Content + Footer) */}
      <div className="flex-1 flex flex-col h-screen">
        
        {/* Navbar (Atas - Fixed) */}
        <div className="flex-none z-40">
           <Navbar />
        </div>

        {/* Area Konten (TENGAH - SCROLLABLE) */}
        {/* Outlet adalah tempat Home, Dashboard, Todo, dll muncul */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
           <Outlet /> 
        </main>

        {/* Footer (Bawah - Fixed) */}
        {/* <div className="flex-none z-40">
           <Footer />
        </div> */}

      </div>
      
    </div>
  );
};

export default Layout;
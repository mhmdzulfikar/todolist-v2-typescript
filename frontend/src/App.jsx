import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// --- PAGES IMPORTS ---
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CardNavPage from "./pages/CardNavPage"; 
import SnippetLibrary from "./pages/SnippetLibrary";
import LandingPage from "./pages/LandingPage"; 

// 🔥 IMPORT BARU (YANG KITA MIGRASI)
// Dulu: import Todo from "./pages/Todo";
// Sekarang:
import TodoPage from "./pages/TodoPage"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- HALAMAN PUBLIC (Tanpa Sidebar) --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- HALAMAN PRIVATE (Pakai Layout/Sidebar) --- */}
        <Route element={<Layout />}>
           <Route path="/home" element={<Home />} />
           <Route path="/dashboard" element={<Dashboard />} />
           
           {/* 🔥 UPDATE ROUTE INI */}
           {/* Sekarang path /todo ngebuka TodoPage.tsx (Yang isinya Tab Tasks & Notes) */}
           <Route path="/todo" element={<TodoPage />} />
           
           <Route path="/cardnav" element={<CardNavPage />} />
           <Route path="/snippets" element={<SnippetLibrary />}/>
           
           {/* ❌ DELETE ROUTE INI: 
              <Route path="/todoinput" element={<TodoInput />}/> 
              
              Kenapa? Karena TodoInput sekarang udah jadi komponen kecil 
              di dalam TodoList, bukan halaman sendiri lagi.
           */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
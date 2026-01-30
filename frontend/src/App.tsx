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
           <Route path="/todo" element={<TodoPage />} />
           <Route path="/cardnav" element={<CardNavPage />} />
           <Route path="/snippets" element={<SnippetLibrary />}/>
           
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
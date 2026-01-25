import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import TodoInput from "./pages/TodoInput"; // (hanya untuk latihan)
import CardNavPage from "./pages/CardNavPage"; 
import SnippetLibrary from "./pages/SnippetLibrary";

import LandingPage from "./pages/LandingPage"; 

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
           <Route path="/todo" element={<Todo />} />
           <Route path="/cardnav" element={<CardNavPage />} />
           <Route path="/snippets" element={<SnippetLibrary />}/>
           <Route path="/todoinput" element={<TodoInput />}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
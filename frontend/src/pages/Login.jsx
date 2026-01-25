import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginUser } from "../services/api";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const data = await loginUser({ email, password });
      
      // 🔥 SIMPAN DATA PENTING KE SAKU BROWSER
      localStorage.setItem('token', data.accessToken);
      
      // Simpan Nama (buat Navbar)
      if (data.name) localStorage.setItem('name', data.name);
      else localStorage.setItem('name', "User");

      // 🔥🔥 SIMPAN ROLE (BUAT FITUR DRAG & DROP ADMIN) 🔥🔥
      // Kalau baris ini ga ada, browser ga bakal tau kamu admin!
      if (data.role) {
          localStorage.setItem('role', data.role);
      } else {
          localStorage.setItem('role', "user"); // Default
      }
      
      navigate("/dashboard"); 
      
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.msg);
      } else {
        setErrorMsg("Login Failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Please sign in to your account</p>
        </div>

        {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                {errorMsg}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input type="email" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input type="password" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
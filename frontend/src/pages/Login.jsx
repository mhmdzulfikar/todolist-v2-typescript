import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // Ganti FaEnvelope jadi FaUser
import { loginUser } from "../services/api";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ name: name, password });
      
      localStorage.setItem('token', data.token);
      
      // Simpan Name
      if (data.name) localStorage.setItem('name', data.name);
      
      // Note: Data name & role mungkin belum ada di response login backend lu saat ini.
      // Nanti biasanya diambil lewat API /me. Tapi kode di bawah ini aman (gak bikin error).
      if (data.name) localStorage.setItem('name', data.name);
      
      if (data.role) {
          localStorage.setItem('role', data.role);
      } else {
          localStorage.setItem('role', "user");
      }
      
      navigate("/dashboard"); 
      
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.msg);
      } else {
        setErrorMsg("Login Failed. Periksa koneksi server.");
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
          
          {/* --- INPUT 1: USERNAME (Bukan Email) --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email or Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              {/* Type text, bukan email */}
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                placeholder="Masukkan email or username..." 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* --- INPUT 2: PASSWORD --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
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
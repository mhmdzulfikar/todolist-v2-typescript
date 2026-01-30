import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; 
import { authService } from "../services/authService"; 

const Login: React.FC = () => { 
  // 2. State Typing: <string>
  // Sebenernya TS cukup pinter nebak ini string, tapi ditulis biar tegas.
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  const navigate = useNavigate();

  // 3. Event Typing: React.FormEvent
  // Ini biar TS tau "e" itu event dari Form Submit, bukan event klik mouse biasa.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); // Reset error dulu sebelum request

    try {
      // Panggil service (sesuaikan nama fungsinya di authService.ts lo)
     const data = await authService.login({ identifier, password });
      
      // Simpan ke LocalStorage
      localStorage.setItem('token', data.token);
      
      // Safety Check: Pake "Optional Chaining" (?.) biar gak crash kalau data.name kosong
      if (data?.name) localStorage.setItem('name', data.name);
      
      // Logic Role
      if (data?.role) {
          localStorage.setItem('role', data.role);
      } else {
          localStorage.setItem('role', "user");
      }
      
      navigate("/dashboard"); 
      
    } catch (error: any) { 
      // 4. Error Typing: any
      // Di TypeScript, error di catch block itu tipe aslinya 'unknown'.
      // Biar cepet dan gak ribet casting, kita pake ': any' dulu.
      // (Kalau cara pro: pake 'if (axios.isAxiosError(error))')
      
      console.error(error);

      if (error.response) {
        // Ambil pesan error dari backend (biasanya di msg atau message)
        setErrorMsg(error.response.data.msg || error.response.data.message || "Login Gagal");
      } else if (error.request) {
        setErrorMsg("Server tidak merespon. Cek koneksi backend.");
      } else {
        setErrorMsg("Terjadi kesalahan sistem.");
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

        {/* Conditional Rendering buat Error Message */}
        {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center animate-pulse">
                {errorMsg}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* --- INPUT 1: EMAIL/USERNAME --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email or Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                placeholder="Masukkan email atau username..." 
                value={identifier} 
                // 5. onChange Event gak perlu ditulis (e: ChangeEvent) kalau inline gini,
                // TS udah pinter nebak sendiri.
                onChange={(e) => setIdentifier(e.target.value)} 
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

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg cursor-pointer">
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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
// Import API
import { registerUser } from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // Buat nampilin error
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Reset error

    try {
      // Panggil API Register
      await registerUser({ name, email, password });
      
      // Kalau sukses, lempar ke halaman login
      alert("Registration Successful! Please Login.");
      navigate("/login");
    } catch (error) {
      // Kalau gagal (misal email kembar), tampilkan pesan error dari backend
      if (error.response) {
        setErrorMsg(error.response.data.msg);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join us and start organizing your tasks</p>
        </div>

        {/* Tampilkan Error Merah jika ada */}
        {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                {errorMsg}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
           {/* ... (Input Name, Email, Password SAMA SEPERTI SEBELUMNYA) ... */}
           {/* Copy aja input-input dari file sebelumnya, gak ada yang berubah */}
           
           {/* Name */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input type="email" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Password */}
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
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log In</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
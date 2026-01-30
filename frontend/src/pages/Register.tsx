import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaCheckCircle } from "react-icons/fa"; // Icon
import { authService } from "../services/authService"; 

const Register: React.FC = () => {

  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confPassword, setConfPassword] = useState<string>(""); 
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      await authService.register({ 
          email: name,
          password: password,
          confirmPassword: confPassword
      });
      
      alert("Registration Successful! Please Login.");
      navigate("/login");
    } catch (error: any) {
      if (error.response) {
                setErrorMsg(error.response.data.msg || error.response.data.message || "Registeration Failed");
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

        {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                {errorMsg}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
           
           {/* INPUT 1: USERNAME (Bukan Name) */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email or Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                placeholder="Email or Username" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Email gue HAPUS karena di Controller lu gak ada simpan email kan? 
              Tapi kalau mau dipasang buat pajangan doang gapapa, asal jangan dikirim ke API kalau API nolak. 
          */}

          {/* INPUT 2: PASSWORD */}
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

          {/* INPUT 3: CONFIRM PASSWORD (WAJIB ADA) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCheckCircle className="text-gray-400" />
              </div>
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                placeholder="Ketik ulang password..." 
                value={confPassword} 
                onChange={(e) => setConfPassword(e.target.value)} 
                required 
              />
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
import React from "react";
import { FaHeart, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // mt-auto penting: Supaya footer terdorong ke paling bawah kalau kontennya sedikit
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="px-6 py-6 md:flex md:items-center md:justify-between">
        
        {/* BAGIAN KIRI: Copyright & Brand */}
        <div className="flex flex-col md:flex-row items-center gap-2 mb-4 md:mb-0">
          <span className="text-lg font-bold  from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MyApp
          </span>
          <span className="text-sm text-gray-500">
            © {currentYear} All Rights Reserved.
          </span>
        </div>

        {/* BAGIAN TENGAH: Made with Love */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4 md:mb-0">
          <span>Made with</span>
          <FaHeart className="text-red-500 animate-pulse" /> 
          <span>by</span>
          <a 
            href="https://github.com/username-kamu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            MALAS NGODING
          </a>
        </div>

        {/* BAGIAN KANAN: Social Links */}
        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors text-xl">
            <FaGithub />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-xl">
            <FaLinkedin />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-xl">
            <FaTwitter />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaRedo, FaCoffee, FaBrain } from "react-icons/fa";

const Pomodoro = () => {
  // Default: 25 menit (Work), 5 menit (Break)
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("work"); // 'work' or 'break'

  // 🔥 1. PINDAHKAN FUNGSI INI KE ATAS (Sebelum useEffect)
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsActive(false); // Stop timer pas ganti mode
    if (newMode === "work") {
      setMinutes(25);
      setSeconds(0);
    } else {
      setMinutes(5);
      setSeconds(0);
    }
  };

  const playSound = () => {
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    audio.play().catch(e => console.log("Audio play failed", e)); // Catch error kalau browser nge-block autoplay
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === "work") {
        setMinutes(25);
        setSeconds(0);
    } else {
        setMinutes(5);
        setSeconds(0);
    }
  };

  // 🔥 2. BARU JALANKAN USE EFFECT DI BAWAHNYA
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // WAKTU HABIS!
            clearInterval(interval);
            setIsActive(false); // Stop dulu
            playSound(); // Bunyi ting!
            
            // Otomatis ganti mode
            if (mode === "work") {
                handleModeChange("break");
            } else {
                handleModeChange("work");
            }
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]); // Dependency array

  return (
    <div className="bg-gray-100 dark:bg-[#252526] p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      
      {/* Header Kecil */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {mode === "work" ? "🔥 Focus" : "☕ Break"}
        </span>
        <div className="flex gap-2">
            <button 
                onClick={() => handleModeChange("work")} 
                className={`p-1.5 rounded-md transition-all ${mode === "work" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-gray-400 hover:text-gray-600"}`}
                title="Work Mode"
            >
                <FaBrain size={12} />
            </button>
            <button 
                onClick={() => handleModeChange("break")} 
                className={`p-1.5 rounded-md transition-all ${mode === "break" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "text-gray-400 hover:text-gray-600"}`}
                title="Break Mode"
            >
                <FaCoffee size={12} />
            </button>
        </div>
      </div>

      {/* Angka Timer Besar */}
      <div className="text-4xl font-mono font-bold text-gray-800 dark:text-gray-100 text-center mb-4 tracking-widest">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      {/* Tombol Kontrol */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 py-2 rounded-lg font-medium text-white shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2
            ${isActive 
                ? "bg-yellow-500 hover:bg-yellow-600" 
                : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {isActive ? <><FaPause size={12}/> Pause</> : <><FaPlay size={12}/> Start</>}
        </button>
        
        <button
          onClick={resetTimer}
          className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Reset"
        >
          <FaRedo size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pomodoro;
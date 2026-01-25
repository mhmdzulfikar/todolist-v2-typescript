import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { getNotifications } from "../services/api";
import { formatDistanceToNow } from 'date-fns'; 

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState([]);

  // 🔥 SOLUSI: Logic Fetch ada DI DALAM useEffect
  useEffect(() => {
    
    const fetchNotifs = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Gagal ambil notif:", error);
      }
    };

    fetchNotifs();
    
    // Opsional: Pasang interval biar update sendiri tiap 10 detik
    // const interval = setInterval(fetchNotifs, 10000);
    // return () => clearInterval(interval);

  }, []); // Array kosong = Jalan 1x pas dibuka

  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
      
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-700">Notifications</h3>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">Belum ada info terbaru.</div>
        ) : (
            notifications.map((notif) => (
            <div 
                key={notif.id} 
                className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 bg-indigo-50/20"
            >
                <div className="mt-1">
                {/* Icon Dinamis */}
                {notif.type === "admin" && <FaInfoCircle className="text-blue-500" />}
                {notif.type === "success" && <FaCheckCircle className="text-green-500" />}
                {notif.type === "warning" && <FaExclamationTriangle className="text-orange-500" />}
                </div>

                <div>
                <h4 className="text-sm font-bold text-gray-800">{notif.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                
                {/* Waktu Otomatis */}
                <p className="text-[10px] text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </p>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
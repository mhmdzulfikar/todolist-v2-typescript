const Notification = require('../models/Notification');

// Ambil notif (Urutkan dari yang terbaru)
const getNotifications = async (req, res) => {
    try {
        const notifs = await Notification.findAll({
            order: [['createdAt', 'DESC']],
            limit: 20 // Naikkan dikit limitnya
        });
        res.json(notifs);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Buat notif baru (Broadcast)
const createNotification = async (req, res) => {
    try {
        // 1. Tangkap data dari Frontend
        const { title, message, type } = req.body;

        // 2. Validasi sederhana
        if(!message) return res.status(400).json({msg: "Pesan tidak boleh kosong"});

        // 3. Simpan ke Database
        // Kalau title tidak dikirim frontend, kita kasih default "Info Admin"
        await Notification.create({
            title: title || "Info Admin 📢", 
            message: message,
            type: type || "admin"
        });

        res.json({ msg: "Notifikasi Terkirim!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Gagal membuat notifikasi" });
    }
}

module.exports = { getNotifications, createNotification };
const express = require('express');
const { getNotifications, createNotification } = require('../controllers/notificationController');
// 🔥 IMPORT MIDDLEWARE
const { verifyToken } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Pasang verifyToken biar aman
router.get('/', verifyToken, getNotifications);
router.post('/', verifyToken, createNotification);

module.exports = router;
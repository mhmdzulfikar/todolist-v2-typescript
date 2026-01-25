const express = require('express');
const { getNote, updateNote } = require('../controllers/noteController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, getNote);
router.put('/', verifyToken, updateNote);

module.exports = router;
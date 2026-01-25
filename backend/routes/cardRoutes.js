const express = require('express');
const { getCards, createCard, updateCardStatus, deleteCard } = require('../controllers/cardController');
const router = express.Router();

// Definisi Rute
router.get('/', getCards);
router.post('/', createCard);
router.put('/:id', updateCardStatus);
router.delete('/:id', deleteCard);

module.exports = router;
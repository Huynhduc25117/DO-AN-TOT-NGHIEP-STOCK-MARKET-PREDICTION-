const express = require('express');
const router = express.Router();
const stockNewsController = require('../controllers/newsController');

// Route để lấy tin tức chứng khoán
router.get('/news', stockNewsController.getStockNews);

module.exports = router;
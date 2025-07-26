// src/routes/predictRoutes.js
const express = require('express');
const { savePredictHistory, getPredictHistory } = require('../controllers/predictController');
const { authMiddleware } = require('../controllers/authController');
const router = express.Router();

router.post('/history', authMiddleware, savePredictHistory); // POST /api/predict/history
router.get('/history', authMiddleware, getPredictHistory);   // GET /api/predict/history

module.exports = router;
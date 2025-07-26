// src/routes/authRoutes.js
const express = require('express');
const { register, login, getUser, updateUser, authMiddleware } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware, getUser);
router.post('/user/update', authMiddleware, updateUser);

module.exports = router;
// src/models/UserModels.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null }, // Thay address bằng dateOfBirth
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
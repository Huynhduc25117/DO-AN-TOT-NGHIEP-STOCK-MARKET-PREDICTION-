// src/models/PredictHistory.js
const mongoose = require('mongoose');

const predictHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stockCode: { type: String, required: true }, // ticker
  modelType: { type: String, required: true }, // model_type
  dates: [{ type: String, required: true }], // Mảng các ngày
  predictions: [{ type: Number, required: true }], // Mảng các giá trị dự đoán
}, { timestamps: true });

module.exports = mongoose.model('PredictHistory', predictHistorySchema);
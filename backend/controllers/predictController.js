// src/controllers/predictController.js
const PredictHistory = require('../model/PredictHistory');

// Lưu lịch sử dự đoán
const savePredictHistory = async (req, res) => {
  const { stockCode, modelType, dates, predictions } = req.body;

  try {
    const history = new PredictHistory({
      userId: req.userId, // Lấy từ authMiddleware
      stockCode,
      modelType,
      dates,
      predictions,
    });
    await history.save();
    res.status(201).json({ message: 'Predict history saved', history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy lịch sử dự đoán của người dùng
const getPredictHistory = async (req, res) => {
  try {
    const history = await PredictHistory.find({ userId: req.userId }).sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { savePredictHistory, getPredictHistory };
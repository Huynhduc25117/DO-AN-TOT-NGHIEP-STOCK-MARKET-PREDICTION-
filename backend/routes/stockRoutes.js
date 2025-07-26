const express = require("express");
const { getStockHistory } = require("../controllers/stockController");
const router = express.Router();

router.get("/history", getStockHistory); // Lấy dữ liệu lịch sử

module.exports = router;

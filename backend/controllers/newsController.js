const axios = require('axios');
const config = require('../config/apiConfig');

const getStockNews = async (req, res) => {
  try {
    const symbol = req.query.symbol || 'AAPL'; // Mặc định là Apple nếu không truyền symbol
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${config.alphaVantageApiKey}`
    );

    const newsData = response.data.feed || [];
    res.status(200).json({
      success: true,
      data: newsData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy tin tức chứng khoán',
      error: error.message,
    });
  }
};

module.exports = { getStockNews };
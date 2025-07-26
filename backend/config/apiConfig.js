require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
  YAHOO_FINANCE_API: process.env.YAHOO_FINANCE_API || 'your_yahoo_finance_api_key_here', // Thêm YAHOO_FINANCE_API
};
const yahooFinance = require("yahoo-finance2").default;

// Hàm an toàn để gọi toFixed
const safeToFixed = (value, decimals = 2) => {
    const numericValue = parseFloat(value); // Chuyển đổi giá trị thành số
    if (!isNaN(numericValue)) {
        return numericValue.toFixed(decimals);
    }
    return "-"; // Trả về dấu "-" nếu giá trị không hợp lệ
};

// API lấy dữ liệu lịch sử chứng khoán cho tất cả các mã
const getStockHistory = async (req, res) => {
    try {
        const symbols = req.query.symbols?.split(",") || ["AAPL", "MSFT", "GOOGL"];
        console.log("Lấy dữ liệu lịch sử cho các mã: ", symbols); // In ra các mã chứng khoán đang yêu cầu
        const stockData = [];

        for (const symbol of symbols) {
            console.log(`Lấy dữ liệu lịch sử cho mã ${symbol}...`); // In ra mã chứng khoán đang xử lý

            // Sử dụng 'period1' là '2000-01-01' để lấy tất cả dữ liệu có sẵn
            const historical = await yahooFinance.historical(symbol, {
                period1: "2020-01-01",
                interval: "1d", // Dữ liệu hàng ngày
            });

            // Kiểm tra xem có dữ liệu lịch sử trả về không
            if (!historical || historical.length < 2) {
                console.warn(`Không có đủ dữ liệu cho mã ${symbol}.`);
                continue; // Tiếp tục với mã chứng khoán khác nếu không có dữ liệu đủ
            }

            const closePrices = historical.map((day) => day.close);
            const volume = historical[historical.length - 1].volume || 0;

            const stockInfo = historical.map((day, index) => {
                const priceChange = index === 0 ? 0 : closePrices[index] - closePrices[index - 1];
                const dailyReturn = index === 0 || closePrices[index - 1] === 0 ? null : priceChange / closePrices[index - 1];

                const volatility = index >= 4
                    ? Math.sqrt(
                        closePrices
                            .slice(index - 4, index + 1)
                            .reduce((acc, val) => acc + Math.pow(val - closePrices[index], 2), 0) / 5
                    )
                    : null;

                const ma5 = index >= 4
                    ? closePrices.slice(index - 4, index + 1).reduce((acc, val) => acc + val, 0) / 5
                    : null;

                const ma10 = index >= 9
                    ? closePrices.slice(index - 9, index + 1).reduce((acc, val) => acc + val, 0) / 10
                    : null; // Tính MA 10

                return {
                    Ticker: symbol, // Thêm trường Ticker
                    Date: day.date.toISOString().split("T")[0], // Chuyển đổi ngày sang định dạng YYYY-MM-DD
                    Open: safeToFixed(day.open), // Thêm Open
                    High: safeToFixed(day.high), // Thêm High
                    Low: safeToFixed(day.low), // Thêm Low
                    Close: safeToFixed(day.close), // Thêm Close
                    Volume: volume, // Thêm Volume
                    Price_Change: safeToFixed(priceChange), // Thêm Price Change
                    Daily_Return: safeToFixed(dailyReturn), // Thêm Daily Return
                    Volatility: safeToFixed(volatility), // Thêm Volatility
                    MA_5: safeToFixed(ma5), // Thêm MA 5
                    MA_10: safeToFixed(ma10), // Thêm MA 10
                };
            });

            stockData.push({
                symbol,
                data: stockInfo,
            });
        }

        // Kiểm tra xem có dữ liệu trả về không
        if (stockData.length === 0) {
            console.error("Không có dữ liệu lịch sử chứng khoán nào.");
            return res.status(404).json({ error: "Không có dữ liệu lịch sử chứng khoán." });
        }

        res.json(stockData);
    } catch (error) {
        console.error("Lỗi lấy dữ liệu lịch sử:", error);
        res.status(500).json({ error: "Không thể lấy dữ liệu lịch sử." });
    }
};

module.exports = { getStockHistory };

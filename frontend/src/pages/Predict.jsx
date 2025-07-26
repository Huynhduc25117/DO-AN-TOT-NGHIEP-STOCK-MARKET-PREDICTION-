import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import Header from '../components/Header';

const STOCK_SYMBOLS = ["AAPL", "AMD", "AMZN", "BA", "BABA", "DIS", "GOOGL", "INTC", "MSFT", "NFLX", "NVDA", "SPY", "TSLA", "WMT"];
const MODELS = ["lstm", "gru", "transformer"];
const DAYS_OPTIONS = [5, 10, 30];

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #2A2D3E 0%, #1E2235 100%)',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(90, 97, 255, 0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
  borderRadius: '8px',
  padding: theme.spacing(1.5),
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #4A51D9, #00C4D3)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    background: 'rgba(90, 97, 255, 0.3)',
    color: '#A0A6C0',
  }
}));

// Hàm xử lý an toàn giá trị số
const safeToFixed = (value, decimals = 2) => {
  const numericValue = parseFloat(value);
  return !isNaN(numericValue) ? numericValue.toFixed(decimals) : null;
};

const Predict = () => {
  const [prediction, setPrediction] = useState(null);
  const [actualData, setActualData] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [model, setModel] = useState("lstm");
  const [days, setDays] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState({
    open: "",
    high: "",
    low: "",
    volume: "",
    price_change: "",
    daily_return: "",
    volatility: "",
    ma_5: "",
    ma_10: "",
  });
  const [lastDate, setLastDate] = useState("");
  const [token] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { symbol, attributes, lastDate } = location.state;
      setSymbol(symbol || "");
      setAttributes({
        open: attributes.open || "",
        high: attributes.high || "",
        low: attributes.low || "",
        volume: attributes.volume || "",
        price_change: attributes.price_change || "",
        daily_return: attributes.daily_return || "",
        volatility: attributes.volatility || "",
        ma_5: attributes.ma_5 || "",
        ma_10: attributes.ma_10 || "",
      });
      setLastDate(lastDate || "");
    }

    if (!token) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [location.state, token, navigate]);

  const handleChange = (e) => {
    setAttributes({ ...attributes, [e.target.name]: e.target.value });
  };

  const fetchActualData = async (ticker, startDate, endDate) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stock/history?symbols=${ticker}`);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const stockData = response.data[0].data;
        const filteredData = stockData.filter(row => {
          const rowDate = new Date(row.Date);
          return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
        });
        setActualData(filteredData);
      }
    } catch (error) {
      console.error("❌ Lỗi lấy dữ liệu thực tế:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!symbol) {
      setError("Vui lòng chọn mã chứng khoán.");
      return;
    }

    if (Object.values(attributes).some(val => val === "" || isNaN(Number(val)))) {
      setError("Vui lòng nhập đầy đủ và đúng định dạng số cho tất cả các thuộc tính.");
      return;
    }

    if (!token) {
      setError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setLoading(true);

    try {
      const lastDateObj = new Date(lastDate || new Date());
      const predictResponse = await axios.post('http://127.0.0.1:5000/predict', {
        ticker: symbol,
        forecast_days: days,
        input_features: [[
          Number(attributes.open),
          Number(attributes.high),
          Number(attributes.low),
          Number(attributes.volume),
          Number(attributes.price_change),
          Number(attributes.daily_return),
          Number(attributes.volatility),
          Number(attributes.ma_5),
          Number(attributes.ma_10),
        ]],
        last_date: lastDateObj.toISOString().split("T")[0],
        model_type: model,
      });

      if (predictResponse.status === 200) {
        setPrediction(predictResponse.data);

        const currentDate = new Date();
        const predictionDates = predictResponse.data.dates.map(date => new Date(date));
        const hasPastDates = predictionDates.some(date => date < currentDate);

        if (hasPastDates) {
          const startDate = new Date(Math.min(...predictionDates));
          const endDate = new Date(Math.max(...predictionDates.filter(date => date <= currentDate)));
          await fetchActualData(symbol, startDate, endDate);
        }

        try {
          const historyResponse = await axios.post('http://localhost:5000/api/predict/history', {
            stockCode: predictResponse.data.ticker,
            modelType: predictResponse.data.model_type,
            dates: predictResponse.data.dates,
            predictions: predictResponse.data.predictions,
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (historyResponse.status !== 201 && historyResponse.status !== 200) {
            console.warn("Lưu lịch sử thất bại nhưng dự đoán thành công:", historyResponse.data);
          }
        } catch (historyError) {
          if (historyError.response?.status === 403) {
            setError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
            setTimeout(() => navigate('/login'), 2000);
          } else {
            console.error("Lỗi khi lưu lịch sử:", historyError);
          }
        }
      } else {
        setError("Lỗi từ máy chủ dự đoán.");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi dự đoán. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Dữ liệu biểu đồ: Kết hợp dự đoán và thực tế
  const chartData = prediction
    ? prediction.dates.map((date, index) => {
        const actualRow = actualData.find(row => row.Date === date);
        return {
          date: new Date(date).toLocaleDateString(),
          predicted: Number(safeToFixed(prediction.predictions[index])),
          actual: actualRow ? Number(safeToFixed(actualRow.Close)) : null,
        };
      })
    : [];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: 'linear-gradient(135deg, #1E2235 0%, #2A2D3E 100%)',
      py: 6,
      px: { xs: 2, md: 4 }
    }}>
      <Header />
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          mb: 4, 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Dự Đoán Thị Trường Chứng Khoán
      </Typography>

      {error && (
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ mb: 2, color: '#FF6B6B' }}
        >
          {error}
        </Typography>
      )}

      <StyledCard sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth error={!!error && !symbol}>
                  <InputLabel sx={{ color: '#A0A6C0' }}>Mã chứng khoán</InputLabel>
                  <Select
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    sx={{ color: '#FFFFFF', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3D4157' } }}
                  >
                    {STOCK_SYMBOLS.map((stock) => (
                      <MenuItem key={stock} value={stock}>{stock}</MenuItem>
                    ))}
                  </Select>
                  {error && !symbol && <FormHelperText sx={{ color: '#FF6B6B' }}>{error}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#A0A6C0' }}>Mô hình</InputLabel>
                  <Select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    sx={{ color: '#FFFFFF', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3D4157' } }}
                  >
                    {MODELS.map((mdl) => (
                      <MenuItem key={mdl} value={mdl}>{mdl.toUpperCase()}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#A0A6C0' }}>Khoảng thời gian</InputLabel>
                  <Select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    sx={{ color: '#FFFFFF', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3D4157' } }}
                  >
                    {DAYS_OPTIONS.map((day) => (
                      <MenuItem key={day} value={day}>{day} ngày</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {Object.keys(attributes).map((key) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <TextField
                    fullWidth
                    label={key.replace("_", " ").toUpperCase()}
                    name={key}
                    value={attributes[key]}
                    onChange={handleChange}
                    type="number"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#2A2D3E',
                        '& fieldset': { borderColor: '#3D4157' },
                        '&:hover fieldset': { borderColor: '#5A61FF' },
                      },
                      '& .MuiInputLabel-root': { color: '#A0A6C0' },
                      '& .MuiInputBase-input': { color: '#FFFFFF' },
                    }}
                    error={error && (attributes[key] === "" || isNaN(Number(attributes[key])))}
                    helperText={error && (attributes[key] === "" || isNaN(Number(attributes[key]))) ? "Nhập số hợp lệ" : ""}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <StyledButton 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Dự Đoán Ngay"}
                </StyledButton>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </StyledCard>

      {prediction && (
        <StyledCard>
          <CardContent>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                color: '#FFFFFF' 
              }}
            >
              Dự đoán cho {prediction.ticker}
            </Typography>
            <Box sx={{ mb: 3, color: '#D0D5EB' }}>
              <Typography variant="body1">Mô hình: {prediction.model_type.toUpperCase()}</Typography>
              <Typography variant="body1">Khoảng thời gian: {prediction.dates.length} ngày</Typography>
            </Box>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D4157" />
                <XAxis 
                  dataKey="date" 
                  stroke="#A0A6C0" 
                  tick={{ fill: '#A0A6C0' }} 
                />
                <YAxis 
                  stroke="#A0A6C0" 
                  tick={{ fill: '#A0A6C0' }} 
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2A2D3E', 
                    border: '1px solid #3D4157', 
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Legend wrapperStyle={{ color: '#D0D5EB' }} />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  name="Dự đoán" 
                  stroke="#5A61FF" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#00DDEB' }}
                />
                {actualData.length > 0 && (
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    name="Thực tế" 
                    stroke="#FF6B6B" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: '#FF6B6B' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </StyledCard>
      )}

      {!prediction && !loading && (
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ mt: 4, color: '#A0A6C0' }}
        >
          Nhập dữ liệu và nhấn "Dự Đoán Ngay" để xem kết quả.
        </Typography>
      )}
    </Box>
  );
};

export default Predict;
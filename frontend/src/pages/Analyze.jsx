import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: 'linear-gradient(145deg, #2A2D3E 0%, #1E2235 100%)',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(90, 97, 255, 0.1)',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(90, 97, 255, 0.1)',
    transition: 'background-color 0.3s ease-in-out',
  },
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

const safeToFixed = (value, decimals = 2) => {
  const numericValue = parseFloat(value);
  return !isNaN(numericValue) ? numericValue.toFixed(decimals) : "-";
};

const safeToLocaleString = (value) => {
  const numericValue = parseFloat(value);
  return !isNaN(numericValue) ? numericValue.toLocaleString() : "-";
};

const Analyze = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("Close");
  const [selectedDate, setSelectedDate] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // Thêm state cho bộ lọc thời gian
  const symbols = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "INTC", "AMD", "NFLX", "SPY", "BABA", "DIS", "BA", "WMT"];
  const metrics = ["Open", "High", "Low", "Close", "Volume", "Price_Change", "Daily_Return", "Volatility", "MA_5", "MA_10"];
  const timeFilters = ["all", "week", "month", "year"]; // Các tùy chọn lọc thời gian
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stock/history?symbols=${symbols.join(",")}`);
        if (response.data && Array.isArray(response.data)) {
          setHistoricalData(response.data);
          const urlParams = new URLSearchParams(window.location.search);
          const symbolFromUrl = urlParams.get('symbol');
          setSelectedSymbol(symbolFromUrl || response.data[0]?.symbol || "");
        }
        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi lấy dữ liệu lịch sử:", error);
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSymbolChange = (event) => {
    setSelectedSymbol(event.target.value);
    setPage(0);
  };

  const handleMetricChange = (event) => {
    setSelectedMetric(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };

  const handlePredict = () => {
    if (!selectedSymbol || !selectedDate) {
      alert("Vui lòng chọn mã chứng khoán và ngày để dự đoán!");
      return;
    }

    const selectedStockData = historicalData.find(stock => stock.symbol === selectedSymbol);
    if (!selectedStockData) return;

    const selectedRow = selectedStockData.data.find(row => row.Date === selectedDate);
    if (!selectedRow) {
      alert("Không tìm thấy dữ liệu cho ngày đã chọn!");
      return;
    }

    navigate('/predict', {
      state: {
        symbol: selectedSymbol,
        attributes: {
          open: selectedRow.Open,
          high: selectedRow.High,
          low: selectedRow.Low,
          volume: selectedRow.Volume,
          price_change: selectedRow.Price_Change,
          daily_return: selectedRow.Daily_Return,
          volatility: selectedRow.Volatility,
          ma_5: selectedRow.MA_5,
          ma_10: selectedRow.MA_10,
        },
        lastDate: selectedDate
      }
    });
  };

  // Hàm lọc dữ liệu theo khoảng thời gian
  const filterDataByTime = (data) => {
    if (!data || timeFilter === "all") return data;

    const now = new Date();
    let startDate;

    switch (timeFilter) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return data;
    }

    return data.filter(row => new Date(row.Date) >= startDate);
  };

  const selectedStockData = historicalData.find(stock => stock.symbol === selectedSymbol);
  const filteredData = selectedStockData ? filterDataByTime(selectedStockData.data) : [];

  const chartData = filteredData.length > 0 ? {
    labels: filteredData.map(row => row.Date),
    datasets: [
      {
        label: selectedMetric,
        data: filteredData.map(row => row[selectedMetric]),
        borderColor: '#00DDEB',
        backgroundColor: 'rgba(0, 221, 235, 0.2)',
        fill: true,
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true, 
        text: `${selectedMetric} của ${selectedSymbol} (${timeFilter === "all" ? "Tất cả" : timeFilter === "week" ? "Tuần" : timeFilter === "month" ? "Tháng" : "Năm"})`
      }
    },
    scales: {
      x: { title: { display: true, text: 'Ngày' } },
      y: { title: { display: true, text: selectedMetric } }
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: 'linear-gradient(135deg, #1E2235 0%, #2A2D3E 100%)',
      pt: 0,
      px: { xs: 2, md: 4 }
    }}>
      <Header />
      <Box sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          THỊ TRƯỜNG CHỨNG KHOÁN
        </Typography>

        {historicalData.length > 0 ? (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: '#D0D5EB' }}>Mã</InputLabel>
                <Select
                  value={selectedSymbol}
                  onChange={handleSymbolChange}
                  label="Mã"
                  sx={{ color: '#D0D5EB', backgroundColor: 'rgba(90, 97, 255, 0.2)' }}
                >
                  {symbols.map(symbol => (
                    <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: '#D0D5EB' }}>Giá trị</InputLabel>
                <Select
                  value={selectedMetric}
                  onChange={handleMetricChange}
                  label="Giá trị"
                  sx={{ color: '#D0D5EB', backgroundColor: 'rgba(90, 97, 255, 0.2)' }}
                >
                  {metrics.map(metric => (
                    <MenuItem key={metric} value={metric}>{metric}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: '#D0D5EB' }}>Khoảng thời gian</InputLabel>
                <Select
                  value={timeFilter}
                  onChange={handleTimeFilterChange}
                  label="Khoảng thời gian"
                  sx={{ color: '#D0D5EB', backgroundColor: 'rgba(90, 97, 255, 0.2)' }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="week">Tuần</MenuItem>
                  <MenuItem value="month">Tháng</MenuItem>
                  <MenuItem value="year">Năm</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <TextField
                  label="Chọn ngày"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  InputLabelProps={{ shrink: true, style: { color: '#D0D5EB' } }}
                  InputProps={{ style: { color: '#D0D5EB', backgroundColor: 'rgba(90, 97, 255, 0.2)' } }}
                />
              </FormControl>

              <StyledButton onClick={handlePredict}>
                Dự đoán
              </StyledButton>
            </Box>

            {filteredData.length > 0 && chartData ? (
              <Box sx={{ mb: 6, backgroundColor: '#2A2D3E', p: 2, borderRadius: '12px' }}>
                <Line data={chartData} options={chartOptions} height={100} />
              </Box>
            ) : (
              <Typography sx={{ color: '#A0A6C0', textAlign: 'center', py: 4 }}>
                Không có dữ liệu để hiển thị biểu đồ
              </Typography>
            )}

            {selectedStockData && (
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    {selectedStockData.symbol}
                  </Typography>
                  <Chip 
                    label="Historical Data" 
                    size="small" 
                    sx={{ 
                      background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
                      color: '#FFFFFF'
                    }} 
                  />
                </Box>

                <StyledTableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {[
                          "Ngày", "Mở", "Cao", "Thấp", "Đóng cửa", 
                          "Khối lượng", "Thay đổi", "Lợi nhuận", 
                          "Biến động", "MA 5", "MA 10"
                        ].map((header) => (
                          <TableCell 
                            key={header}
                            sx={{ 
                              backgroundColor: 'rgba(90, 97, 255, 0.2)', 
                              color: '#FFFFFF',
                              fontWeight: 600,
                              borderBottom: '1px solid rgba(90, 97, 255, 0.3)'
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                            {[...Array(11)].map((_, j) => (
                              <TableCell key={j}>
                                <Skeleton variant="text" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        filteredData
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, rowIndex) => (
                            <StyledTableRow key={rowIndex}>
                              <TableCell sx={{ color: '#D0D5EB' }}>{row.Date}</TableCell>
                              <TableCell sx={{ color: '#D0D5EB' }}>{safeToFixed(row.Open)}</TableCell>
                              <TableCell sx={{ color: '#D0D5EB' }}>{safeToFixed(row.High)}</TableCell>
                              <TableCell sx={{ color: '#D0D5EB' }}>{safeToFixed(row.Low)}</TableCell>
                              <TableCell sx={{ color: '#D0D5EB' }}>{safeToFixed(row.Close)}</TableCell>
                              <TableCell sx={{ color: '#D0D5EB' }}>{safeToLocaleString(row.Volume)}</TableCell>
                              <TableCell 
                                sx={{ 
                                  color: row.Price_Change >= 0 ? '#00DDEB' : '#FF6B6B',
                                  fontWeight: 500
                                }}
                              >
                                {safeToFixed(row.Price_Change)}
                              </TableCell>
                              <TableCell 
                                sx={{ 
                                  color: row.Daily_Return >= 0 ? '#00DDEB' : '#FF6B6B',
                                  fontWeight: 500
                                }}
                              >
                                {safeToFixed(row.Daily_Return * 100)}%
                              </TableCell>
                              <TableCell sx={{ color: '#D0D5EB' }}>{safeToFixed(row.Volatility, 4)}</TableCell>
                              <TableCell sx={{ color: '#D0D5EB' }}>{safeToFixed(row.MA_5)}</TableCell>
                              <TableCell sx={{ color: '#D0D5EB' }}>{safeToFixed(row.MA_10)}</TableCell>
                            </StyledTableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                  {!loading && (
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={filteredData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{ color: '#D0D5EB' }}
                    />
                  )}
                </StyledTableContainer>
              </Box>
            )}
          </Box>
        ) : (
          <Typography sx={{ color: '#A0A6C0', textAlign: 'center', py: 4 }}>
            {loading ? "Đang tải dữ liệu..." : "Không có dữ liệu để hiển thị"}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Analyze;
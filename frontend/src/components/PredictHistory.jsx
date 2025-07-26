// src/components/PredictHistory.js
import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Header from './Header';

const HistorySection = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, #2A2D3E 0%, #1E2235 100%)',
  borderRadius: '12px',
  padding: theme.spacing(4),
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(90, 97, 255, 0.2)',
  color: '#FFFFFF',
}));

const PredictHistory = () => {
  const theme = useTheme();
  const [history, setHistory] = useState([]);
  const [token] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/predict/history', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch predict history');
        const data = await response.json();
        // Đảm bảo data là mảng, nếu không thì trả về rỗng
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching predict history:', error);
        setHistory([]);
      }
    };

    if (token) fetchHistory();
  }, [token]);

  const renderChart = (dates, predictions) => {
    const chartData = dates && predictions && dates.length === predictions.length
      ? dates.map((date, index) => ({
          date: new Date(date).toLocaleDateString(),
          price: Number(predictions[index]?.toFixed(2) || 0),
        }))
      : [];

    return (
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3D4157" />
          <XAxis dataKey="date" stroke="#A0A6C0" tick={{ fill: '#A0A6C0', fontSize: 10 }} />
          <YAxis stroke="#A0A6C0" tick={{ fill: '#A0A6C0', fontSize: 10 }} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2A2D3E',
              border: '1px solid #3D4157',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
          />
          <Line type="monotone" dataKey="price" stroke="#5A61FF" strokeWidth={1} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1E2235', color: '#FFFFFF' }}>
      <Header />
      <Container sx={{ py: 6 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 6,
            fontWeight: 700,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Lịch Sử Dự Đoán
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <HistorySection>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Danh Sách Dự Đoán
              </Typography>
              <Divider sx={{ mb: 3, borderColor: 'rgba(90, 97, 255, 0.3)' }} />
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="predict history table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#D0D5EB', fontWeight: 600 }}>Mã Chứng Khoán</TableCell>
                      <TableCell sx={{ color: '#D0D5EB', fontWeight: 600 }}>Mô Hình</TableCell>
                      <TableCell sx={{ color: '#D0D5EB', fontWeight: 600 }}>Ngày Tạo</TableCell>
                      <TableCell sx={{ color: '#D0D5EB', fontWeight: 600 }}>Biểu Đồ Dự Đoán</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.length > 0 ? (
                      history.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell sx={{ color: '#FFFFFF' }}>{item.stockCode || 'N/A'}</TableCell>
                          <TableCell sx={{ color: '#FFFFFF' }}>
                            {item.modelType ? item.modelType.toUpperCase() : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ color: '#FFFFFF' }}>
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ color: '#FFFFFF' }}>
                            {renderChart(item.dates, item.predictions)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ color: '#D0D5EB', textAlign: 'center' }}>
                          Chưa có lịch sử dự đoán
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </HistorySection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PredictHistory;
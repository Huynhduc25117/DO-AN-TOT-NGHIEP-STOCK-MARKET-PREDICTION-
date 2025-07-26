import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// Định nghĩa các font chữ chung
const primaryFont = '"Roboto", "Helvetica", "Arial", sans-serif';
const headingFont = '"Montserrat", "Roboto", sans-serif';

// Danh sách mã chứng khoán đồng bộ với Analyze và Predict
const STOCK_SYMBOLS = ["AAPL", "AMD", "AMZN", "BA", "BABA", "DIS", "GOOGL", "INTC", "MSFT", "NFLX", "NVDA", "SPY", "TSLA", "WMT"];

// Styled components
const StyledHeroBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1E2235 0%, #2A2D3E 100%)',
  color: '#FFFFFF',
  padding: theme.spacing(10),
  borderRadius: theme.spacing(3),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at center, rgba(90, 97, 255, 0.3), transparent)',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #2A2D3E 0%, #1E2235 100%)',
  color: '#FFFFFF',
  borderRadius: theme.spacing(2),
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(90, 97, 255, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 48px rgba(90, 97, 255, 0.3)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
  borderRadius: '10px',
  padding: theme.spacing(1.5, 4),
  fontWeight: 700,
  fontFamily: primaryFont,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(90, 97, 255, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #4A51D9, #00C4D3)',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(90, 97, 255, 0.5)',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: '#D0D5EB',
  fontFamily: primaryFont,
  backgroundColor: 'rgba(90, 97, 255, 0.15)',
  borderRadius: '8px',
  '& .MuiSelect-icon': {
    color: '#00DDEB',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(90, 97, 255, 0.3)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#00DDEB',
  },
}));

const FooterLink = styled(Button)(({ theme }) => ({
  color: '#D0D5EB',
  fontFamily: primaryFont,
  fontWeight: 500,
  textTransform: 'none',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#00DDEB',
  },
}));

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = useState('');

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const handleQuickAnalyze = () => {
    if (selectedStock) {
      // Chuyển hướng đến trang Analyze với mã chứng khoán đã chọn
      navigate(`/analyze?symbol=${selectedStock}`);
    } else {
      navigate('/analyze');
    }
  };


  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1E2235', color: '#FFFFFF' }}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <StyledHeroBox
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: headingFont,
            fontWeight: 900,
            background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            [theme.breakpoints.down('md')]: { fontSize: '2.5rem' },
          }}
        >
          StockVision - Stock Prediction
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: primaryFont,
            mb: 5,
            color: '#D0D5EB',
            maxWidth: '700px',
            margin: '0 auto',
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center">
          <StyledButton
            onClick={() => navigate('/analyze')}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Phân Tích Ngay
          </StyledButton>
          <StyledButton
            onClick={() => navigate('/predict')}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Dự Đoán Giá
          </StyledButton>
        </Stack>
      </StyledHeroBox>

      {/* Quick Access Panel */}
      <Container sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 5,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: headingFont,
              mb: 4,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Truy Cập Nhanh
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <FormControl sx={{ minWidth: 240 }}>
              <InputLabel sx={{ color: '#D0D5EB', fontWeight: 500, fontFamily: primaryFont }}>
                Chọn Mã Cổ Phiếu
              </InputLabel>
              <StyledSelect
                value={selectedStock}
                onChange={handleStockChange}
                label="Chọn Mã Cổ Phiếu"
              >
                {STOCK_SYMBOLS.map((symbol) => (
                  <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
            <StyledButton
              onClick={handleQuickAnalyze}
              startIcon={<ShowChartIcon />}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Phân Tích
            </StyledButton>
          </Stack>
        </Paper>
      </Container>

      {/* Feature Section */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: headingFont,
            mb: 8,
            fontWeight: 800,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Tính Năng
        </Typography>
        <Grid container spacing={5}>
          {/* Analyze Card */}
          <Grid item xs={12} md={4}>
            <StyledCard
              component={motion.div}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(90, 97, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(90, 97, 255, 0.5)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(90, 97, 255, 0.4)',
                        transform: 'scale(1.1)',
                      },
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShowChartIcon
                      sx={{
                        color: '#00DDEB',
                        fontSize: 32,
                        filter: 'drop-shadow(0 0 4px rgba(0, 221, 235, 0.5))',
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: headingFont,
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Phân Tích Dữ Liệu
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontFamily: primaryFont,
                    color: '#D0D5EB',
                    mb: 3,
                    lineHeight: 1.7,
                    fontSize: '1rem',
                  }}
                >
                  Khám phá dữ liệu lịch sử chi tiết của các mã chứng khoán với biểu đồ trực quan và các chỉ số kỹ thuật chuyên sâu.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  sx={{
                    fontFamily: primaryFont,
                    color: '#00DDEB',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { color: '#5A61FF' },
                  }}
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/analyze')}
                >
                  Khám Phá Ngay
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>

          {/* Predict Card */}
          <Grid item xs={12} md={4}>
            <StyledCard
              component={motion.div}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(90, 97, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(90, 97, 255, 0.5)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(90, 97, 255, 0.4)',
                        transform: 'scale(1.1)',
                      },
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <TimelineIcon
                      sx={{
                        color: '#00DDEB',
                        fontSize: 32,
                        filter: 'drop-shadow(0 0 4px rgba(0, 221, 235, 0.5))',
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: headingFont,
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Dự Đoán Giá
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontFamily: primaryFont,
                    color: '#D0D5EB',
                    mb: 3,
                    lineHeight: 1.7,
                    fontSize: '1rem',
                  }}
                >
                  Sử dụng các mô hình AI tiên tiến như LSTM, GRU và Transformer để dự đoán giá chứng khoán trong tương lai.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  sx={{
                    fontFamily: primaryFont,
                    color: '#00DDEB',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { color: '#5A61FF' },
                  }}
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/predict')}
                >
                  Khám Phá Ngay
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>

          {/* News Card */}
          <Grid item xs={12} md={4}>
            <StyledCard
              component={motion.div}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(90, 97, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(90, 97, 255, 0.5)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(90, 97, 255, 0.4)',
                        transform: 'scale(1.1)',
                      },
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <NewspaperIcon
                      sx={{
                        color: '#00DDEB',
                        fontSize: 32,
                        filter: 'drop-shadow(0 0 4px rgba(0, 221, 235, 0.5))',
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: headingFont,
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Tin Tức Thị Trường
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontFamily: primaryFont,
                    color: '#D0D5EB',
                    mb: 3,
                    lineHeight: 1.7,
                    fontSize: '1rem',
                  }}
                >
                  Cập nhật tin tức nóng hổi và phân tích chuyên sâu từ các nguồn uy tín, giúp bạn đưa ra quyết định đầu tư sáng suốt.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  sx={{
                    fontFamily: primaryFont,
                    color: '#00DDEB',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { color: '#5A61FF' },
                  }}
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/news')}
                >
                  Khám Phá Ngay
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 6,
          backgroundColor: '#2A2D3E',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <Typography
          variant="body1"
          sx={{
            fontFamily: primaryFont,
            mb: 3,
            color: '#D0D5EB',
            fontWeight: 500,
          }}
        >
          © 2025 DQK StockVision. All rights reserved.
        </Typography>
        <Stack direction="row" spacing={4} justifyContent="center" mb={3}>
          <FooterLink onClick={() => navigate('/analyze')}>
            Phân Tích
          </FooterLink>
          <FooterLink onClick={() => navigate('/predict')}>
            Dự Đoán
          </FooterLink>
          <FooterLink onClick={() => navigate('/news')}>
            Tin Tức
          </FooterLink>
        </Stack>
        <Typography
          variant="body2"
          sx={{
            fontFamily: primaryFont,
            color: '#A0A6C0',
          }}
        >
          Designed with ❤️ by TTTN G38 DQK.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
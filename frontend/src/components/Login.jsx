import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Styled components
const LoginBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(145deg, #2A2D3E 0%, #1E2235 100%)',
  borderRadius: '12px',
  padding: theme.spacing(4),
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(90, 97, 255, 0.2)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
  borderRadius: '10px',
  padding: theme.spacing(1.5, 4),
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(90, 97, 255, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #4A51D9, #00C4D3)',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(90, 97, 255, 0.5)',
  },
}));


const Login = ({ toggleRegister }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', user.email);
      alert('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };


  return (
    <Grid container sx={{ height: '100vh', backgroundColor: '#1E2235', color: '#FFFFFF' }}>
      {/* Form đăng nhập bên trái */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <LoginBox>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 800,
                background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome To DQK
            </Typography>
            <Box
              component="img"
              src="/image/logo.png"
              sx={{ width: 100, height: 'auto', mb: 3, display: 'block', mx: 'auto' }}
            />
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
              Đăng Nhập Tài Khoản
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#D0D5EB' } }}
                InputProps={{ style: { color: '#FFFFFF' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(90, 97, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: '#00DDEB' },
                  },
                }}
              />
              <TextField
                name="password"
                label="Mật khẩu"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#D0D5EB' } }}
                InputProps={{ style: { color: '#FFFFFF' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(90, 97, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: '#00DDEB' },
                  },
                }}
              />
              {error && (
                <Typography variant="body2" sx={{ color: '#FF5252', mb: 2 }}>
                  {error}
                </Typography>
              )}
              <StyledButton type="submit" fullWidth sx={{ mt: 3 }}>
                Đăng Nhập
              </StyledButton>
            </form>


            <Typography mt={3} variant="body2" sx={{ color: '#D0D5EB', textAlign: 'center' }}>
              Chưa có tài khoản?{' '}
              <Button
                variant="text"
                sx={{
                  color: '#00DDEB',
                  fontWeight: 'bold',
                  '&:hover': { color: '#5A61FF' },
                }}
                onClick={toggleRegister}
              >
                Đăng Ký
              </Button>
            </Typography>
          </LoginBox>
        </Container>
      </Grid>

      {/* Phần giới thiệu bên phải */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Predict. Invest. Succeed.
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#D0D5EB', maxWidth: '500px' }}>
            DQK là ứng dụng web dự đoán xu hướng thị trường chứng khoán bằng phân tích dữ liệu và máy học, giúp bạn đưa ra quyết định đầu tư sáng suốt.
          </Typography>
          <Box
            component="img"
            src="/image/loginbackground.jpg"
            alt="Dashboard preview"
            sx={{ width: '100%', maxWidth: 500, borderRadius: 2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)' }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
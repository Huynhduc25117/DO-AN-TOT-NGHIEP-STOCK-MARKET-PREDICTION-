import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
  
  const ProfileSection = styled(Paper)(({ theme }) => ({
    background: 'linear-gradient(145deg, #2A2D3E 0%, #1E2235 100%)',
    borderRadius: '12px',
    padding: theme.spacing(4),
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(90, 97, 255, 0.2)',
    color: '#FFFFFF',
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
  
  const Profile = () => {
    const theme = useTheme();
    const [user, setUser] = useState({
      name: '', // Sử dụng name để đồng bộ với backend (username)
      email: '',
      phone: '',
      dateOfBirth: '', // Thay address bằng dateOfBirth
    });
    const [editUser, setEditUser] = useState({ ...user });
    const [token, setToken] = useState(localStorage.getItem('token') || '');
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/user', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Failed to fetch user data');
          const data = await response.json();
          setUser(data);
          setEditUser(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          const storedEmail = localStorage.getItem('userEmail') || '';
          setUser({ name: 'User Name', email: storedEmail, phone: '', dateOfBirth: '' });
          setEditUser({ name: 'User Name', email: storedEmail, phone: '', dateOfBirth: '' });
        }
      };
  
      if (token) fetchUserData();
    }, [token]);
  
    const handleChange = (e) => {
      setEditUser({ ...editUser, [e.target.name]: e.target.value });
    };
  
    const handleUpdateProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user/update', {
          method: 'POST',
          body: JSON.stringify(editUser),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          localStorage.setItem('userEmail', updatedUser.email);
          alert('Cập nhật thông tin thành công!');
        } else {
          throw new Error('Cập nhật thất bại');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Có lỗi xảy ra khi cập nhật!');
      }
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
            Quản Lý Thông Tin Cá Nhân
          </Typography>
  
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ProfileSection>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Thông Tin Người Dùng
                </Typography>
                <Divider sx={{ mb: 3, borderColor: 'rgba(90, 97, 255, 0.3)' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body1">
                    <strong>Tên người dùng:</strong> {user.name || 'Chưa cập nhật'} {/* Hiển thị username */}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {user.email || 'Chưa cập nhật'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Số điện thoại:</strong> {user.phone || 'Chưa cập nhật'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Ngày sinh:</strong> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Chưa cập nhật'} {/* Thay address bằng dateOfBirth */}
                  </Typography>
                </Box>
              </ProfileSection>
            </Grid>
  
            <Grid item xs={12} md={6}>
              <ProfileSection>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Cập Nhật Thông Tin
                </Typography>
                <Divider sx={{ mb: 3, borderColor: 'rgba(90, 97, 255, 0.3)' }} />
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    name="name"
                    label="Tên người dùng"
                    variant="outlined"
                    fullWidth
                    value={editUser.name || ''}
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
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={editUser.email || ''}
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
                    name="phone"
                    label="Số điện thoại"
                    variant="outlined"
                    fullWidth
                    value={editUser.phone || ''}
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
                    name="dateOfBirth"
                    label="Ngày sinh"
                    type="date"
                    variant="outlined"
                    fullWidth
                    value={editUser.dateOfBirth ? new Date(editUser.dateOfBirth).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    InputLabelProps={{ style: { color: '#D0D5EB' }, shrink: true }}
                    InputProps={{ style: { color: '#FFFFFF' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(90, 97, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: '#00DDEB' },
                      },
                    }}
                  />
                  <StyledButton onClick={handleUpdateProfile}>
                    Cập Nhật Thông Tin
                  </StyledButton>
                </Box>
              </ProfileSection>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  };
  
  export default Profile;
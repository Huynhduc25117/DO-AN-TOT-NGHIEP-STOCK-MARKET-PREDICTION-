import AccountCircle from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State để quản lý dropdown menu
  const navigate = useNavigate();

  // Lấy email từ localStorage
  const userEmail = localStorage.getItem('userEmail') || 'Guest';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mở dropdown menu khi hover vào icon
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // Xóa thông tin người dùng
    navigate('/login'); // Chuyển hướng về trang đăng nhập
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile'); // Chuyển hướng đến trang Profile (tùy chỉnh theo route của bạn)
    handleMenuClose();
  };

  const handlePredictHistory = () => {
    navigate('/predict-history'); // Chuyển hướng đến trang Predict History (tùy chỉnh theo route của bạn)
    handleMenuClose();
  };

  const navItems = [
    { label: 'DASHBOARD', path: '/' },
    { label: 'MARKET', path: '/analyze' },
    { label: 'PREDICTION', path: '/predict' },
    { label: 'NEWS', path: '/news' },
  ];

  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#1E2235', height: '100%' }}>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: '#D0D5EB',
              '&:hover': {
                backgroundColor: 'rgba(90, 97, 255, 0.2)',
                color: '#FFFFFF',
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem
          onClick={handleLogout}
          sx={{
            color: '#D0D5EB',
            '&:hover': {
              backgroundColor: 'rgba(255, 82, 82, 0.2)',
              color: '#FF5252',
            },
          }}
        >
          <ListItemText primary="LOGOUT" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(90deg, #1E2235 0%, #2A2D3E 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(90, 97, 255, 0.2)',
      }}
    >
      <Toolbar sx={{ minHeight: '80px !important', justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            transition: 'all 0.3s',
            '&:hover': {
              opacity: 0.9,
              transform: 'translateY(-1px)',
            },
          }}
        >
          <img
            src="/image/logo.png"
            alt="Logo"
            style={{
              height: '45px',
              width: '45px',
              filter: 'brightness(1.2)',
              transition: 'all 0.3s',
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #5A61FF, #00DDEB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
              fontSize: '1.5rem',
            }}
          >
            StockVision
          </Typography>
        </Box>

        {/* Điều hướng Desktop */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 3,
            alignItems: 'center',
          }}
        >
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  color: '#D0D5EB',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '1rem',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(90, 97, 255, 0.2)',
                    color: '#FFFFFF',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Profile Icon với Dropdown */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
          }}
        >
          <IconButton
            onMouseEnter={handleMenuOpen} // Mở menu khi hover
            sx={{
              color: '#FFFFFF',
              p: 1,
              borderRadius: '50%',
              border: '1px solid rgba(90, 97, 255, 0.3)',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(90, 97, 255, 0.2)',
                borderColor: '#5A61FF',
                transform: 'rotate(360deg)',
              },
            }}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          <Typography
            sx={{
              ml: 1,
              color: '#D0D5EB',
              fontWeight: 500,
              display: { xs: 'none', md: 'inline' },
            }}
          >
            {userEmail.split('@')[0]} {/* Hiển thị phần trước @ của email */}
          </Typography>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onMouseLeave={handleMenuClose} // Đóng menu khi chuột rời khỏi
            PaperProps={{
              sx: {
                backgroundColor: '#2A2D3E',
                color: '#D0D5EB',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(90, 97, 255, 0.2)',
              },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon sx={{ color: '#00DDEB' }} />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem onClick={handlePredictHistory}>
              <ListItemIcon>
                <HistoryIcon sx={{ color: '#00DDEB' }} />
              </ListItemIcon>
              <ListItemText primary="Predict History" />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: '#FF5252' }} />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#1E2235',
            color: '#FFFFFF',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
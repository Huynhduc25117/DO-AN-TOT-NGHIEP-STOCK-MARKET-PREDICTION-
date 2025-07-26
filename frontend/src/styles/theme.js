import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff0000', // Màu đỏ cho các phần tử chính
    },
    secondary: {
      main: '#ffffff', // Màu trắng cho các phần tử phụ
    },
    background: {
      default: '#f4f4f4', // Màu nền nhẹ nhàng
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      fontSize: 32,
      color: '#ff0000',
    },
    h6: {
      fontWeight: 600,
      fontSize: 20,
      color: '#333',
    },
  },
});

export default theme;

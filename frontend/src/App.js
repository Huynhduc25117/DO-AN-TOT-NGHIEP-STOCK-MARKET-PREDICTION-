import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./components/HomeComponents";
import Login from "./components/Login";
import NewsPage from "./components/NewsPage"; // Thêm import component tin tức
import PredictHistory from './components/PredictHistory';
import Register from "./components/Register";
import Analyze from './pages/Analyze.jsx';
import Logout from './pages/Logout.jsx';
import Predict from "./pages/Predict.jsx"; // Thêm import trang dự đoán
import Profile from './pages/Profile.jsx';
import theme from './styles/theme'; // Import theme đã tạo
function App() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <ThemeProvider theme={theme}> {/* Áp dụng theme cho toàn bộ ứng dụng */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              isRegister ? (
                <Register toggleRegister={() => setIsRegister(false)} />
              ) : (
                <Login toggleRegister={() => setIsRegister(true)} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/predict" element={<Predict />} /> {/* Thêm route trang dự đoán */}
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/predict-history" element={<PredictHistory />} /> {/* Thêm route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

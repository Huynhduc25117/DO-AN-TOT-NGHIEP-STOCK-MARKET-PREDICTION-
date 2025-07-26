import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

// Giả sử file header của bạn nằm ở thư mục components và tên là Header.js
import Header from "../components/Header"; // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn

const NewsCard = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(145deg, #2A2D3E 0%, #1E2235 100%)",
  borderRadius: "12px",
  padding: theme.spacing(3),
  transition: "all 0.3s ease-in-out",
  border: "1px solid rgba(90, 97, 255, 0.1)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    borderColor: "rgba(90, 97, 255, 0.3)",
  },
}));

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/news/news");
        if (!response.ok) {
          throw new Error("Không thể lấy tin tức");
        }
        const data = await response.json();
        console.log("Dữ liệu từ API:", data); // Debug dữ liệu nhận được
        setNews(data.data || []); // Lấy mảng từ data.data, mặc định là [] nếu không có
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy tin tức:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1E2235 0%, #2A2D3E 100%)",
      }}
    >
      {/* Thêm Header đã import */}
      <Header />

      {/* Nội dung chính */}
      <Box
        sx={{
          py: 6,
          maxWidth: "1440px",
          margin: "0 auto",
          px: { xs: 2, md: 4 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 700,
            background: "linear-gradient(45deg, #5A61FF, #00DDEB)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TrendingUpIcon fontSize="large" />
          Tin Tức Chứng Khoán
        </Typography>

        {error && (
          <Typography sx={{ color: "#FF6B6B", textAlign: "center", mb: 4 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {loading ? (
            // Skeleton loading
            [1, 2, 3, 4].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <NewsCard>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={40}
                    sx={{ mt: 2 }}
                  />
                </NewsCard>
              </Grid>
            ))
          ) : news.length > 0 ? (
            news.map((article, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <NewsCard>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Chip
                      label="Mới nhất"
                      size="small"
                      sx={{
                        background: "linear-gradient(45deg, #5A61FF, #00DDEB)",
                        color: "#FFFFFF",
                        fontWeight: 500,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "#A0A6C0" }}>
                      {article.source || "Không rõ nguồn"}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#FFFFFF",
                      mb: 2,
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.title || "Không có tiêu đề"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#D0D5EB",
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.summary || "Không có mô tả"}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      color: "#A0A6C0",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2">
                        {article.time_published
                          ? new Date(
                              article.time_published.slice(0, 4) +
                                "-" +
                                article.time_published.slice(4, 6) +
                                "-" +
                                article.time_published.slice(6, 8)
                            ).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <VisibilityIcon fontSize="small" />
                      <Typography variant="body2">N/A</Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    sx={{
                      color: "#00DDEB",
                      borderColor: "#00DDEB",
                      "&:hover": { borderColor: "#5A61FF", color: "#5A61FF" },
                    }}
                    component={Link}
                    href={article.url || "#"}
                    target="_blank"
                  >
                    Xem chi tiết
                  </Button>
                </NewsCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="body1"
                sx={{ color: "#A0A6C0", textAlign: "center", py: 4 }}
              >
                Không có tin tức nào để hiển thị
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default NewsPage;
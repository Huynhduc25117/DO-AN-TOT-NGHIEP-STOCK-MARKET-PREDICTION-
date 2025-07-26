# 📈 Nghiên cứu và xây dựng website dự đoán thị trường chứng khoán bằng Deep Learning

## 🧠 Giới thiệu

Thị trường chứng khoán là một lĩnh vực quan trọng, phản ánh tình hình tài chính và sự phát triển của doanh nghiệp cũng như nền kinh tế. Việc dự đoán xu hướng giá cổ phiếu đóng vai trò then chốt giúp nhà đầu tư đưa ra quyết định chính xác, tối ưu hóa lợi nhuận và giảm thiểu rủi ro.

Dự án này xây dựng một hệ thống ứng dụng các mô hình học sâu như **LSTM, GRU và Transformer** để dự đoán giá cổ phiếu, đồng thời phát triển một website trực quan giúp người dùng dễ dàng theo dõi và phân tích kết quả dự báo.

---

## 🎯 Mục tiêu dự án

- Xây dựng hệ thống dự đoán giá cổ phiếu dựa trên dữ liệu lịch sử.
- So sánh hiệu suất các mô hình học sâu: **LSTM, GRU, Transformer**.
- Cung cấp **website tương tác**: cho phép chọn mã cổ phiếu, mô hình, khoảng dự đoán (5, 10, 30 ngày).
- Hiển thị kết quả dưới dạng **bảng dữ liệu** và **biểu đồ trực quan**.
- Hỗ trợ cập nhật dữ liệu thị trường theo thời gian thực.

---

## 🛠️ Công nghệ sử dụng

- **Ngôn ngữ & thư viện**:
  - Python (Pandas, NumPy, scikit-learn, TensorFlow/Keras)
  - Node.js / Flask (Backend API)
  - React.js + Material UI + Recharts (Frontend)

- **Mô hình học sâu**:
  - LSTM (Long Short-Term Memory)
  - GRU (Gated Recurrent Unit)
  - Transformer (Attention-based)

- **Dữ liệu**:
  - Thu thập từ Yahoo Finance (API)
  - Bao gồm: `Open`, `Close`, `High`, `Low`, `Volume`, `MA_5`, `MA_10`, `Volatility`, `Daily Return`, v.v.
  - Tập trung vào 14 mã cổ phiếu toàn cầu (Apple, Tesla, Microsoft, v.v.)

---

## 🚀 Cách chạy dự án

bash
# Clone repo
git clone https://github.com/yourusername/stock-prediction-lstm.git
cd stock-prediction-lstm

# Cài đặt thư viện
pip install -r requirements.txt

# Huấn luyện mô hình
python train_model.py

# Trực quan hóa kết quả
python visualize_predictions.py

# (Tuỳ chọn) Khởi chạy website
S1: cd backend 
nodemon index.js
S2: cd frontend
npm install
npm run dev

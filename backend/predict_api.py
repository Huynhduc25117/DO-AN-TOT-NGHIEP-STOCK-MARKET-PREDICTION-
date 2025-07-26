from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import joblib
import os
from datetime import datetime, timedelta
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

# Cấu hình logging
logging.basicConfig(level=logging.DEBUG)

# Đọc mô hình đã huấn luyện (LSTM, GRU, Transformer)
def load_model_by_type(ticker, model_type):
    model_dir = ''
    
    # Xác định thư mục chứa mô hình dựa trên loại mô hình
    if model_type == 'lstm':
        model_dir = 'models/lstm_models'
    elif model_type == 'gru':
        model_dir = 'models/gru_models'
    elif model_type == 'transformer':
        model_dir = 'models/transformer_models'
    else:
        logging.error(f"Loại mô hình không hợp lệ: {model_type}")
        return None
    
    model_path = f'{model_dir}/{ticker}_{model_type}_model.keras'
    if os.path.exists(model_path):
        logging.info(f"Đã tải mô hình từ: {model_path}")
        return load_model(model_path)
    
    logging.error(f"Không tìm thấy mô hình {model_type} cho mã chứng khoán {ticker} tại {model_path}")
    return None

# Đọc scaler đã lưu
def load_scaler(ticker):
    scaler_path = f'scaler/{ticker}_scaler.pkl'
    if os.path.exists(scaler_path):
        logging.info(f"Đã tải scaler từ: {scaler_path}")
        return joblib.load(scaler_path)
    logging.error(f"Không tìm thấy scaler cho mã chứng khoán {ticker} tại {scaler_path}")
    return None

# Xử lý dữ liệu đầu vào cho mô hình
def preprocess_input_data(input_features, scaler, model_type):
    columns = ['Open', 'High', 'Low', 'Volume', 'Price_Change', 'Daily_Return', 'Volatility', 'MA_5', 'MA_10']
    
    # Xác định timestep dựa trên loại mô hình
    timesteps = 10 if model_type == 'lstm' else 5
    
    logging.debug(f"Input Features: {input_features}")
    
    # Nếu dữ liệu chỉ có 1 ngày, lặp lại để đủ `timesteps`
    if len(input_features) == 1:
        input_features = input_features * timesteps
    
    # Chuyển thành DataFrame và chuẩn hóa
    input_data = pd.DataFrame(input_features, columns=columns)
    scaled_input = scaler.transform(input_data)

    logging.debug(f"Scaled Input: {scaled_input}")
    
    # Định dạng lại cho mô hình (samples, timesteps, features)
    return scaled_input.reshape(1, timesteps, len(columns))

# Hàm chuyển đổi giá trị dự đoán về giá trị gốc
def inverse_transform_predictions(predictions, input_data, scaler, model_type):
    timesteps = 10 if model_type == 'lstm' else 5
    features = 9  # Số đặc trưng
    
    # Thêm giá trị dự đoán vào input_data để giải mã
    input_data_copy = input_data.copy()
    
    predicted_values = []
    for prediction in predictions:
        # Thêm dự đoán vào input_data
        new_input = np.roll(input_data_copy, shift=-1, axis=1)  # Dịch sang trái
        new_input[0, -1, :] = prediction  # Gán giá trị dự đoán vào hàng cuối
        input_data_copy = new_input

        # Chuyển đổi input_data_copy[0, -1, :-1] thành mảng 2 chiều
        input_data_copy_values = input_data_copy[0, -1, :-1].reshape(1, -1)

        # Ghép dữ liệu đầu vào với giá trị dự đoán
        combined_data = np.hstack((input_data_copy_values, np.array([prediction]).reshape(-1, 1)))
        
        # Giải mã giá trị dự đoán
        predicted_values.append(scaler.inverse_transform(combined_data.reshape(1, -1))[:, -1][0])

    return predicted_values

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Nhận dữ liệu từ request
        data = request.get_json()

        ticker = data.get('ticker')
        forecast_days = data.get('forecast_days', 5)
        input_features = data.get('input_features')
        last_date_str = data.get('last_date', datetime.today().strftime('%Y-%m-%d'))
        model_type = data.get('model_type', 'lstm')  # Chọn mô hình (lstm, gru, transformer)

        logging.info(f"Received data: {data}")

        if not ticker or not input_features or not model_type:
            logging.error("Thiếu thông tin mã chứng khoán, dữ liệu đầu vào hoặc loại mô hình.")
            return jsonify({"error": "Thiếu thông tin mã chứng khoán, dữ liệu đầu vào hoặc loại mô hình."}), 400

        # Load mô hình và scaler
        model = load_model_by_type(ticker, model_type)
        scaler = load_scaler(ticker)

        if model is None or scaler is None:
            return jsonify({"error": f"Không tìm thấy mô hình {model_type} hoặc scaler cho mã chứng khoán này."}), 400

        # Xác định timestep dựa trên loại mô hình
        timesteps = 10 if model_type == 'lstm' else 5
        features = 9  # Số đặc trưng

        # Xử lý dữ liệu đầu vào
        input_data = preprocess_input_data(input_features, scaler, model_type)

        # Chuyển ngày cuối cùng thành dạng datetime
        last_date = datetime.strptime(last_date_str, '%Y-%m-%d')

        # Dự đoán giá đóng cửa và cập nhật input_data
        predictions = []
        real_dates = []
        
        for i in range(forecast_days):
            prediction = model.predict(input_data)[0][0]
            predictions.append(float(prediction))  # Chuyển thành float
            
            # Tạo một bản sao của input_data để cập nhật
            new_input = np.roll(input_data, shift=-1, axis=1)  # Dịch sang trái
            new_input[0, -1, :] = prediction  # Gán giá trị dự đoán vào hàng cuối

            input_data = new_input.reshape(1, timesteps, features)

            # Cập nhật ngày dự đoán
            real_dates.append((last_date + timedelta(days=i + 1)).strftime('%Y-%m-%d'))

            logging.debug(f"Ngày {i+1}: Dự đoán = {prediction}, Ngày thực = {real_dates[-1]}")

        # Giải mã các giá trị dự đoán
        predictions_real = inverse_transform_predictions(predictions, input_data, scaler, model_type)

        logging.info(f"Final predictions: {predictions_real}")

        return jsonify({"ticker": ticker, "model_type": model_type, "dates": real_dates, "predictions": predictions_real})

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
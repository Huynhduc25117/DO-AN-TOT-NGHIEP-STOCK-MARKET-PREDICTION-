// Import Firebase v9 theo cú pháp mô-đun
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';

// Cấu hình Firebase của bạn
const firebaseConfig = {
apiKey: "AIzaSyCoETqfXFk8drKK7p2ZJcdoHm0-aNGVfds",
authDomain: "stockprediction-3d8b5.firebaseapp.com",
projectId: "stockprediction-3d8b5",
storageBucket: "stockprediction-3d8b5.firebasestorage.app",
messagingSenderId: "634626927449",
appId: "1:634626927449:web:5841afe50ca364d063ba48",
measurementId: "G-NYH6SV5K3R"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ Firebase mà bạn sẽ sử dụng
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Xuất các dịch vụ này để sử dụng trong các component khác
export { auth, onAuthStateChanged, provider, signInWithPopup };


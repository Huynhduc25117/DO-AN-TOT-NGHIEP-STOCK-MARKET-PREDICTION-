// src/Pages/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để thực hiện đăng xuất
        fetch('/api/logout', { method: 'POST' })
            .then(() => {
                // Sau khi đăng xuất thành công, chuyển về trang chủ
                navigate('/');
            });
    }, [navigate]);

    return <div>Đang đăng xuất...</div>;
};

export default Logout;

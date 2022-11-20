import React from 'react';
import { Button, Input, Space } from 'antd';

const MainBar = () => {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.reload();
    }
     return (
    <Space direction="vertical">
    <Button type = "primary" onClick={handleLogout}>Выйти</Button>
    </Space>
     )
}

export default MainBar;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space , Collapse, Drawer} from 'antd';
import AddUser from '../AddUser/AddUser';
import AddCommand from '../AddComand/AddComand';
const {Panel} = Collapse;

const MainBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.reload();
    }
     return (
    <Collapse defaultActiveKey={['1']}>
     <Panel header="Основное меню" style={{fontSize : 22, fontWeight : 600}} key="1">
     <Space direction="horizontal">
     <Button type="primary" onClick={() => navigate("/users")}>Пользователи</Button>
     <Button type = "primary" onClick={() => navigate("/commands")}>Команды</Button>
     <Button type = "primary" onClick={handleLogout}>Выйти</Button>
    </Space>
    </Panel>
    </Collapse>
     )
}

export default MainBar;
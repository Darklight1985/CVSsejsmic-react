
import { useNavigate } from 'react-router-dom';
import { Button, Space , Collapse} from 'antd';
import React from 'react';
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
     <Button type = "primary" onClick={() => navigate("/rooms")}>Помещения</Button>
     <Button type = "primary" onClick={() => navigate("/systems")}>Системы</Button>
     <Button type = "primary" onClick={handleLogout}>Выйти</Button>
    </Space>
    </Panel>
    </Collapse>
     )
}

export default MainBar;
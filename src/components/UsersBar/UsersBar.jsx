import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space , Collapse} from 'antd';
const {Panel} = Collapse;

const UsersBar = () => {
    const [open, setOpen] = useState(false);
    const [openCom, setOpenCom] = useState(false);
    const navigate = useNavigate();

    const showDrawer = () => {
      setOpen(true);
    };

    const onClose = () => {
      setOpen(false);
    };

    const showDrawerCom = () => {
        setOpenCom(true);
      };
  
      const onCloseCom = () => {
        setOpenCom(false);
      };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.reload();
    }
     return (
    <Collapse defaultActiveKey={['1']}>
     <Panel header="Основное меню" style={{fontSize : 22, fontWeight : 600}} key="1">
     <Space direction="horizontal">
     <Button type="primary" onClick={() => navigate("/")}>Вернуться к главной странице</Button>
     <Button type = "primary" onClick={() => navigate("/commands")}>Команды</Button>
     <Button type = "primary" onClick={handleLogout}>Выйти</Button>
    </Space>
    </Panel>
    </Collapse>
     )
}

export default UsersBar;
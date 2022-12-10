import React, { useState } from 'react';
import { Button, Input, Space , Collapse, Drawer} from 'antd';
import AddUser from '../AddUser/AddUser';
import AddCommand from '../AddComand/AddComand';
const {Panel} = Collapse;

const MainBar = () => {
    const [open, setOpen] = useState(false);
    const [openCom, setOpenCom] = useState(false);

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
     <Button type="primary" onClick={showDrawer}>Создать пользователя</Button>
     <Drawer title="Создание пользователя" placement="right" onClose={onClose} open={open}>
        <AddUser></AddUser>
      </Drawer>
    <Button type = "primary" onClick={showDrawerCom}>Создать команду</Button>
    <Drawer title="Создание команды" placement="right" onClose={onCloseCom} open={openCom}>
        <AddCommand></AddCommand>
      </Drawer>
    <Button type = "primary" onClick={handleLogout}>Выйти</Button>
    </Space>
    </Panel>
    </Collapse>
     )
}

export default MainBar;
import React from 'react';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import './Login.css';

async function loginUser(credentials) {
    return fetch(process.env.REACT_APP_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

const Login = ({setToken}) => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          username,
          password
        });
        setToken(token);
      }

  return(
    <Space direction="vertical" style = {{float:'left'}}>
      <h1>Пожалуйста введите логин и пароль</h1>
      <form onSubmit={handleSubmit}>
      <label>
          <p></p>
          <Input placeholder="Логин" onChange={e => setUserName(e.target.value)} prefix={<UserOutlined />} style ={{width: 200}}/>
        </label>
        <label>
          <p></p>
        <Input.Password
          onChange={e => setPassword(e.target.value)}
          placeholder="Пароль"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
          style ={{width: 200}}
        />
        </label>
        <p></p>
        <div>
          <Button type="primary"
            htmlType="submit">Войти</Button>
        </div>
      </form>
      </Space>
  )
}


export default Login;
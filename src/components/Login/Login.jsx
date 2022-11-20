import React from 'react';
import { useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import './Login.css';

async function loginUser(credentials) {
    return fetch('http://localhost:8080/login', {
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
    <Space direction="vertical">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
      <label>
          <p>Имя</p>
          <Input placeholder="default size" onChange={e => setUserName(e.target.value)} prefix={<UserOutlined />} />
        </label>
        <label>
          <p>Пароль</p>
        <Input.Password
          onChange={e => setPassword(e.target.value)}
          placeholder="input password"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
        />
        </label>
        <p></p>
        <div>
          <button type="submit">Войти</button>
        </div>
      </form>
      </Space>
  )
}


export default Login;
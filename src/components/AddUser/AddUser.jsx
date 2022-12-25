import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { DatePicker, Button, Form, Input } from 'antd';


const AddUser = () => {
  const [password, setPassword] = useState();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const token = localStorage.getItem('accessToken').replaceAll("\"", "");
  
    fetch(`http://109.167.155.87:8080/user`, {
        method: 'POST',
        headers: {
            'Authorization' :'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(values)
    })
    .then((res) =>  {
        if (res.status == 403) {
          localStorage.removeItem('accessToken');
          throw new Error ("Время сессии истекло")
        } else {
          return res.json();
        }}).then(res=> {
            alert('Вы успешно создали нового пользователя');
            return res;
        }
        )
      .catch((res) => {
        alert(res);
        window.location.reload();
      });
  };
  return (
    <Form form={form} name="horizontal_login" onFinish={onFinish}>
      <Form.Item
        name="firstName"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите имя пользователя',
          },
        ]}
      >
        <Input  placeholder="Имя пользователя" />
      </Form.Item>
      <Form.Item
        name="secondName"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите фамилию пользователя',
          },
        ]}
      >
        <Input  placeholder="Фамилия пользвателя" />
      </Form.Item>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите логин пользователя',
          },
        ]}
      >
        <Input  placeholder="Логин пользователя" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите пароль пользователя',
          },
        ]}
      >
        <Input.Password
          onChange={e => setPassword(e.target.value)}
          placeholder="Пароль пользователя"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
        />
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Добавить
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};
export default AddUser;

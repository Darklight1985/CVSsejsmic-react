import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { DatePicker, Button, Form, Input } from 'antd';


const AddUser = ({isCreate, data, setData, refreshPage, initialValue, getSort, getUsers}) => {
  const [password, setPassword] = useState();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const newData = [...data];
    const token = localStorage.getItem('accessToken').replaceAll("\"", "");
    if (isCreate) {
    fetch(process.env.REACT_APP_USER, {
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
          const {sort, userAuthors, wordKey, token} = getSort();
          getUsers(sort, userAuthors, wordKey, token);
            newData.push(res);
            setData(newData);
            alert('Вы успешно создали нового пользователя');
            return res;
        }
        )
      .catch((res) => {
        alert(res);
        window.location.reload();
      });

    } else {
      let id = initialValue.id;
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      console.log(index);
      if (index > -1) {
        const item = newData[index];
        console.log(item);
        const token = localStorage.getItem('accessToken').replaceAll("\"", "");
        fetch(process.env.REACT_APP_USER + `/${initialValue.id}`, {
          method: 'PUT',
          headers: {
              'Authorization' :'Bearer ' + token,
              'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(values)
      }).then((res) => {
        if (res.status == 403) {
          localStorage.removeItem('accessToken');
          throw new Error ("Время сессии истекло")
        } else {
          return res.json().
          then(res => {
            console.log(newData)
            console.log(res);
            newData[index] = res;
            setData(newData);
          });}
      })
        .catch((res) => {
        alert(res);
        refreshPage();
      }
      );
  };
    }
  };


  return (
    <Form form={form} name="horizontal_login" onFinish={onFinish} initialValues = {initialValue}>
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
        <Input  placeholder="Фамилия пользователя" />
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
            required: isCreate ? true : false,
            message: 'Пожалуйста введите пароль пользователя',
          },
        ]}
      >
        <Input.Password
          onChange={e => setPassword(e.target.value)}
          placeholder="Пароль пользователя"
          disabled = {!isCreate ? true : false}
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
              isCreate && 
              (!form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length).length)
            }
          >
            {isCreate ? 'Добавить' : 'Отредактировать'}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};
export default AddUser;

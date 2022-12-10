import React, { useEffect, useState, Component } from 'react';
import { DatePicker, Button, Form, Input, Select } from 'antd';


const getUsers = async () =>  {
    return fetch(`http://109.167.155.87:8080/user` , {
      method: 'GET',
      credentials: "include",
      headers: {
          'Authorization' :'Bearer ' + localStorage.getItem('accessToken').replaceAll("\"", ""),
          'Content-Type': 'application/json;charset=utf-8'
      }
     })
      .then((res) =>  {
        if (res.status == 403) {
          localStorage.removeItem('accessToken');
          throw new Error ("Время сессии истекло")
        } else {
          return res.json();
        }})
        .catch((res) => {
        alert(res);
      });
}

const AddCommand = () => {
  const [password, setPassword] = useState();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [users, setUsers] = useState([{value:1, text:"2"}]);
  const [form] = Form.useForm();

  useEffect(() => {
    getSelectUsers();
 }, []);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

   const getSelectUsers = () => {
    getUsers().then(res => {
        let filterAuthor = [];

        for (let key in res) {
          filterAuthor.push({value: res[key].id, label: res[key].firstName})
        }
         setUsers(filterAuthor);
        console.log(filterAuthor)});
   };

  const onFinish = (values) => {
    console.log(values);
    const token = localStorage.getItem('accessToken').replaceAll("\"", "");

   getSelectUsers();

    fetch(`http://109.167.155.87:8080/command`, {
        method: 'POST',
        headers: {
            'Authorization' :'Bearer ' + token,
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({name: values.name, participants :[values.participantsOne, values.participantsTwo]})
    })
    .then((res) =>  {
        if (res.status == 403) {
          localStorage.removeItem('accessToken');
          throw new Error ("Время сессии истекло")
        } else {
          return res.json();
        }}).then(res=> {
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
        name="name"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите имя пользователя',
          },
        ]}
      >
        <Input  placeholder="Имя команды" />
      </Form.Item>
      <Form.Item
        name="participantsOne"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите фамилию пользователя',
          },
        ]}
      >
        <Select
      defaultValue='Выберите сотрудника'
      style={{
        width: 220,
      }}
      onChange={handleChange}
      options={users}
    />
      </Form.Item>
      <Form.Item
        name="participantsTwo"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите логин пользователя',
          },
        ]}
      >
              <Select
      defaultValue='Выберите сотрудника'
      style={{
        width: 220,
      }}
      onChange={handleChange}
      options={users}
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
export default AddCommand;

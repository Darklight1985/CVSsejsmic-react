import React, { useEffect, useState, Component } from 'react';
import { DatePicker, Button, Form, Input, Select, message } from 'antd';


const AddCommand = ({isCreate, data, setData, refreshPage, initialValue, getSort, getCommands}) => {

  const [users, setUsers] = useState([{value:1, text:"2"}]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const info = (message) => {
    messageApi.info(message);
  };

const getUsers = async () =>  {
  return fetch(process.env.REACT_APP_USER , {
    method: 'GET',
    credentials: "include",
    headers: {
        'Authorization' :'Bearer ' + localStorage.getItem('accessToken').replaceAll("\"", ""),
        'Content-Type': 'application/json;charset=utf-8'
    }
   })
    .then((res) =>{
      if (res.status == 403) {
        throw new Error ("Время сессии истекло")
      } else {       
        return res.json();
      }}).then(res => {
        const {content} = res;
        return content;
      })
      .catch((res) => {
        alert(res.error_message);
        localStorage.removeItem('accessToken');
        refreshPage();
    });
}

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

   const onFinish = (oldValues) => {
    console.log(oldValues);
    let participants = [oldValues.participantsOne, oldValues.participantsTwo];
    let values = {name :oldValues.name, participants};
    console.log(values);

    const newData = [...data];
    const token = localStorage.getItem('accessToken').replaceAll("\"", "");
    if (isCreate) {
    fetch(process.env.REACT_APP_COMMAND, {
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
          getCommands(sort, userAuthors, wordKey, token);
            newData.push(res);
            setData(newData);
            info('Вы успешно создали новую команду');
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
      if (index > -1) {
        const item = newData[index];
        console.log(item);
        const token = localStorage.getItem('accessToken').replaceAll("\"", "");
        fetch(process.env.REACT_APP_COMMAND + `/${initialValue.id}`, {
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
    <div>
    {contextHolder}
    <Form form={form} name="horizontal_login" onFinish={onFinish} initialValues = {initialValue}>
      <Form.Item
        name="name"
        rules={[
          {
            required: isCreate ? true : false,
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
      id = 'firstSelecter'
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
              isCreate ? !form.isFieldsTouched(true) : false ||
              !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            {isCreate ? 'Добавить' : 'Отредактировать'}
          </Button>
        )}
      </Form.Item>
    </Form>
    </div>
  );
};
export default AddCommand;

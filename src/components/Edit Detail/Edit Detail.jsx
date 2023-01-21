import { DatePicker, Button, Form, Input,  Select } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState, Component, useLayoutEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es')


const EditDetail = ({isCreate, data, setData, refreshPage, initialValue, getSort, getDetails}) => {
  const [rooms, setRooms] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    getSelectRooms();
 }, []);


  const handleChange = (e) => {
        console.log(e);
  }

  const getRooms = async () =>  {
    return fetch(process.env.REACT_APP_ROOM , {
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
          console.log(res);
       //   const {content} = res;
       return res;
        })
        .catch((res) => {
          alert(res.error_message);
          localStorage.removeItem('accessToken');
          refreshPage();
      });
  }

  const getSelectRooms = () => {
    getRooms().then(res => {
        let filterRoom = [];

        for (let key in res) {
          filterRoom.push({value: res[key].id, label: res[key].name})
        }
         setRooms(filterRoom);
        console.log(filterRoom)});
   };
  
//сделать загрузку фото когда человек вышел из окна добавлени деталей
   const onFinish = (values) => {
    if (isCreate) {
      const newData = [...data];
      const token = localStorage.getItem('accessToken').replaceAll("\"", "");
      fetch(`http://109.167.155.87:8080/detail`, {
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
            getDetails(sort, userAuthors, wordKey, token);
              newData.push(res);
              setData(newData);
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
            fetch(`http://109.167.155.87:8080/detail/${initialValue.id}`, {
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
        name="name"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите имя пользователя',
          },
        ]}
      >
        <Input  placeholder="Наименование детали" id="nameInput" />
      </Form.Item>
      <Form.Item
        name="roundDate"
        rules={[
          {
            required: true,
            message: 'Введите дату обхода',
          },
        ]}
        getValueProps={(value) => ({
          value: value ? dayjs(value) : "",
      })}
      >
        <DatePicker format={'YYYY-MM-DD'} 
        prefix={<LockOutlined className="site-form-item-icon" />} onChange ={handleChange}
        />
      </Form.Item>
      <Form.Item
        name="room"
        rules={[
          {
            required: true,
            message: 'Выберите помещение',
          },
        ]}
      >
      <Select
      defaultValue='Выберите помещение'
      style={{
        width: 220,
      }}
      onChange={handleChange}
      options={rooms}
      id = 'firstSelecter'
    />
    </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
          >
            {isCreate ? 'Добавить' : 'Отредактировать'}
          </Button>
        )}
      </Form.Item>
    </Form>
  );

}
export default EditDetail;
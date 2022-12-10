import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { DatePicker, Button, Form, Input } from 'antd';


const AddDetail = (props) => {

  const [form] = Form.useForm();

  const onFinish = (values) => {
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
            props.fetch();
            return res;
        }
        )
      .catch((res) => {
        alert(res);
        window.location.reload();
      });
  };
  return (
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите название детали',
          },
        ]}
      >
        <Input  placeholder="Название детали" />
      </Form.Item>
      <Form.Item
        name="roundDate"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите дату обхода',
          },
        ]}
      >
        <DatePicker
        prefix={<LockOutlined className="site-form-item-icon" />}
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
export default AddDetail;


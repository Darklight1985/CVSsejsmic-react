import React from 'react';
import { Button, Form, Input, InputNumber, message} from 'antd';
import { createRoom, updateRoom } from '../fetchData';

const AddRoom = ({isCreate, data, setData, initialValue, fetchData}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const info = (message) => {
    messageApi.info(message);
  };

  const onFinish = (values) => {
    if (isCreate) {
      createRoom(data, setData, values, info);
      fetchData();
    } else {
          let id = initialValue.id;
          const newData = [...data];
          const index = newData.findIndex((item) => id === item.id);
          if (index > -1) {
        updateRoom(newData, index, id, values, setData, info);
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
            message: 'Пожалуйста введите наименование помещения',
          },
        ]}
      >
        <Input  placeholder="Наименование помещения" />
      </Form.Item>
      <Form.Item
        name="height"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите высотную отметку',
          },
        ]}
      >
        <InputNumber  placeholder="Высотная отметка" step="0.1"/>
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
export default AddRoom;

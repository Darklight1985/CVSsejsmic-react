import React from 'react';
import { Button, Form, Input, message} from 'antd';
import { createSystem, updateSystem } from '../fetchData';

const AddSystem = ({isCreate, data, setData, initialValue, fetchData}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const info = (message) => {
    messageApi.info(message);
  };

  const onFinish = (values) => {
    if (isCreate) {
      createSystem(data, setData, values, info);
      fetchData();
    } else {
          let id = initialValue.id;
          const newData = [...data];
          const index = newData.findIndex((item) => id === item.id);
          if (index > -1) {
        updateSystem(newData, index, id, values, setData, info);
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
export default AddSystem;

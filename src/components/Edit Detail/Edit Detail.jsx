import { DatePicker, Button, Form, Input,  Select, message } from 'antd';
import { LockOutlined} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getRooms, createDetail, updateDetail } from '../../fetchData';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es')


const EditDetail = ({isCreate, data, setData, refreshPage, initialValue, fetchData}) => {
  const [rooms, setRooms] = useState([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const info = (message) => {
    messageApi.info(message);
  };
  useEffect(() => {
    getSelectRooms();
 }, []);

  const getSelectRooms = () => {
    getRooms(info).then(res => {
        let filterRoom = [];

        for (let key in res) {
          filterRoom.push({value: res[key].id, label: res[key].name})
        }
         setRooms(filterRoom);
        });
   };
  
//сделать загрузку фото когда человек вышел из окна добавлени деталей
   const onFinish = (values) => {
    if (isCreate) {
      createDetail(data, setData, values, info);
      fetchData();
    } else {
          let id = initialValue.id;
          const newData = [...data];
          const index = newData.findIndex((item) => id === item.id);
          if (index > -1) {
        updateDetail(newData, index, id, values, setData, info);
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
        prefix={<LockOutlined className="site-form-item-icon" />} 
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
      options={rooms}
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
    </div>
  );

}
export default EditDetail;
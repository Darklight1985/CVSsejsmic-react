import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './SejsmTable.css';
import AddDetail from './AddDetail/AddDetail';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const SejsmTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      total: 100,
      current: 1,
      pageSize: 10,
    },
  });
  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      roundDate: '',
      createDateTime: '',
      author: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      console.log(index);
      if (index > -1) {
        const item = newData[index];
        console.log(item);
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(row);
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      sorter: true,
      width: '20%',
      editable: true,
    },
    {
      title: 'Дата обхода',
      dataIndex: 'roundDate',
      sorter: true,
      width: '20%',
      editable: true,
    },
    {
      title: 'Дата записи',
      dataIndex: 'createDateTime',
      sorter: true,
    },
    {
      title: 'Автор',
      dataIndex: 'author',
      sorter: true,
    },
    {
      title: 'Операции',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Сохранить
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Отмена</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
          <div>
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Редактировать
          </Typography.Link>
          </div>
          <div>
          <Popconfirm title="Хотите удалить?" onConfirm={() => handleDelete(record.id)}>
            <a>Удалить</a>
          </Popconfirm>
          </div>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const refreshPage = ()=>{
    window.location.reload();
 }

  const fetchData = () => {
    const token = localStorage.getItem('accessToken').replaceAll("\"", "");
    let sort = '';
    if (tableParams.column) {
    let nameColumns = tableParams.column.dataIndex;
    let order = tableParams.order === 'ascend' ? '%2CASC' : '%2CDESC';
    sort = '&sort=' + nameColumns + order;
    }
    console.log(sort);
    setLoading(true);
    fetch(`http://localhost:8080/detail` + `?page=` + `${tableParams.pagination.current - 1}` + `&size` + `${tableParams.pagination.pageSize}` + `${sort}`, {
      method: 'GET',
      headers: {
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Private-Network": "true",
          'Authorization' :'Bearer ' + token,
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
      .then((results) => {
        const {content} = results;
        setData(content);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: results.totalElements,
          },
        });
      }).catch((res) => {
        alert(res);
        refreshPage();
      });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  return (
    <div>
    <AddDetail fetch = {fetchData}/>;
    <Form form={form} component={false}>
    <Table
      components={{
              body: {
                cell: EditableCell,
              },
            }}
      bordered
      columns={mergedColumns}
      rowKey={(record) => record.id}
      dataSource={data}
      rowClassName="editable-row"
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
    </Form>
    </div>
  );
};

export default SejsmTable;

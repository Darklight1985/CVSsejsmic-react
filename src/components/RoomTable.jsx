import { Form, Input, InputNumber, Popconfirm, Table, Drawer, Button, Space, message } from 'antd';
import React, {useEffect, useState } from 'react';
import { getRoom } from '../fetchData';
import { deleteRoom } from '../fetchData';
import AddKeyword from './AddKeyword';
import UsersBar from './UsersBar/UsersBar';
import AddRoom from './AddRoom';
import { useNavigate } from 'react-router-dom';

let isCreate = false;

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

const RoomTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [roomBase, setRoom] = useState();
    const [keyword, setKeyword] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 100,
      },
    });
    const [messageApi, contextHolder] = message.useMessage();
    const info = (message) => {
      messageApi.info(message);
    };
  
    useEffect(() => {
      fetchData();
   }, [JSON.stringify(tableParams), keyword]);

   function showDrawer(e) {
    e.preventDefault();
    const id = e.target.parentNode.id;
    if (id === '') {
      setRoom();
      isCreate = true;
      setOpen(true);
    } else {
      getRoom(id).then(result => {setRoom(result);
      isCreate = false;
    setOpen(true);
    return result;
    });
     }
  };

  const onClose = () => {
    setOpen(false);
  };

   const columns = [
    {
      title: 'Имя',
      dataIndex: 'name',
      sorter: true,
      width: '15%',
      fixed: 'left',
      editable: true,
    },
    {
      title: 'Высотная отметка',
      dataIndex: 'height',
      sorter: true,
      width: '20%',
    },
    {
      title: 'Операции',
      width: '13%',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
          <Space direction="horizontal">
          <Button type="link" onClick={showDrawer} id = {record.id} >Редактировать</Button>
          <Popconfirm title="Хотите удалить?" onConfirm={() => deleteRoom(record.id, info, setData, data)} >
           <a>Удалить</a>
          </Popconfirm>
          </Space>
          </span>
        );
      },
    },
  ];

  const getRooms = (sort, wordKey, token) => {
   fetch(process.env.REACT_APP_ROOM + `/all` +
   `?page=` + `${tableParams.pagination.current - 1}` + 
   `&size=` + `${tableParams.pagination.pageSize}` + 
   `${sort}` + 
   `${wordKey}`, {
     method: 'GET',
     credentials: "include",
     headers: {
         'Authorization' :'Bearer ' + token,
         'Content-Type': 'application/json;charset=utf-8'
     }
    })
    .then((res) =>  {
      if (res.status === 403) {
        throw new Error ("время сессии истекло")
      } else {
        if (res.status === 200) {
          setLoading(false);
          return res.json();
        }
         return res.json();
      }})
    .then((results) => {
      if (results.error_message)
      {
        info (results.error_message);
      } else {
      const {content} = results;
      setData(content);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: results.totalElements,
        },
        });
    }}).catch((res) => {
      alert(res.message);
      localStorage.removeItem('accessToken');
      navigate("/");
    });
}

   const fetchData = () => {
    const {sort, wordKey, token} = getParams();
    getRooms(sort, wordKey, token);
  };

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
      }),
    };
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const getParams = () => {
     var token;
    if (localStorage.getItem('accessToken')) {
      token = localStorage.getItem('accessToken').replaceAll("\"", "");
    } else {
      navigate("/");
    } 
    let sort = '';
    if (tableParams.column) {
    let nameColumns = tableParams.column.dataIndex;
    let order = tableParams.order === 'ascend' ? '%2CASC' : '%2CDESC';
    sort = '&sort=' + nameColumns + order;
    }

    let wordKey = '';
    if (keyword) {
      wordKey = '&keyword=' + keyword;
    } 
   
    setLoading(true);
    return {sort, wordKey, token};
   }

    return (
        <div>
        {contextHolder}
        <UsersBar></UsersBar>
        <Form form={form} component={false}>
        <h1>Таблица помещений</h1>
        <Space direction="horizontal">
        <Space direction="vertical">
        <a>Поиск по ключевому слову</a>
        <AddKeyword keys={keyword} keywordChange = {setKeyword} fetch = {fetchData}/>
        </Space>
        </Space>
        <Button type='primary' onClick={showDrawer} style = {{float:'right'}}>Добавить пользователя</Button>
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
          size ={"small"}
          rowClassName="editable-row"
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          style ={{fontWeight : 600, fontSize : 26}}
          scroll={{
            x: 1500,
            y: 640,
          }}
          
        />
          <Drawer title={`${isCreate ? 'Добавление' : 'Редактирование '} пользователя`} placement="right" onClose={onClose} open={open} destroyOnClose>
           <AddRoom data = {data} setData = {setData} initialValue = {roomBase} isCreate = {isCreate} getSort = {getParams} getRoom = {getRoom} fetch={fetchData}></AddRoom>
          </Drawer>
        </Form>
        </div>
      );
    };

    export default RoomTable;
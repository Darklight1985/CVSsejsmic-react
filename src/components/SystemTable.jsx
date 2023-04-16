import { Form, Input, InputNumber, Popconfirm, Table, Drawer, Button, Space, message } from 'antd';
import React, {useEffect, useState } from 'react';
import { getSystem, deleteSystem } from '../fetchData';
import AddKeyword from './AddKeyword';
import UsersBar from './UsersBar/UsersBar';
import AddSystem from './AddSystem';
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

const SystemTable = () => {
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
      getSystem(id).then(result => {setRoom(result);
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
      title: 'Операции',
      width: '13%',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
          <Space direction="horizontal">
          <Button type="link" onClick={showDrawer} id = {record.id} >Редактировать</Button>
          <Popconfirm title="Хотите удалить?" onConfirm={() => deleteSystem(record.id, info, setData, data)} >
           <a>Удалить</a>
          </Popconfirm>
          </Space>
          </span>
        );
      },
    },
  ];

  const getSystems = (sort, wordKey, token) => {
   fetch(process.env.REACT_APP_SYSTEM + `/all` +
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
        if (res.status >= 400 || res.status < 200) {
          console.log(res.body);
          let resd = res.body.getReader();
          resd.read().then(({done, value}) => {
              let stringOur = new TextDecoder().decode(value);
              if (stringOur instanceof Object) {
              let str = JSON.parse(stringOur).message;
              info(str);
              } else {
                info (stringOur);        
          }})
          setLoading(false);
          return {};
        } else {
          setLoading(false);
          return res.json();
        }
      })
      .then((results) => {
        const {content} = results;
        setData(content);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: results.totalElements,
          },
          });
      })
  }

   const fetchData = () => {
    const {sort, wordKey, token} = getParams();
    getSystems(sort, wordKey, token);
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
        <h1>Таблица технологических систем</h1>
        <Space direction="horizontal">
        <Space direction="vertical">
        <a>Поиск по ключевому слову</a>
        <AddKeyword keys={keyword} keywordChange = {setKeyword} fetch = {fetchData}/>
        </Space>
        </Space>
        <Button type='primary' onClick={showDrawer} style = {{float:'right'}}>Добавить систему</Button>
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
           <AddSystem data = {data} setData = {setData} initialValue = {roomBase} isCreate = {isCreate} getSort = {getParams} getSystem = {getSystem} fetch={fetchData}></AddSystem>
          </Drawer>
        </Form>
        </div>
      );
    };

    export default SystemTable;
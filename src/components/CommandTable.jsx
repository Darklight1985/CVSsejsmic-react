import { Form, Input, InputNumber, Popconfirm, Table, Drawer, Button, Image, Space, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AddKeyword from './AddKeyword';
import UsersBar from './UsersBar/UsersBar';
import AddUser from './AddUser/AddUser';
import AddCommand from './AddComand/AddComand';
import CommandBar from './CommandBar/CommandBar';

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

const CommandTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [commandBase, setCommand] = useState();
    const [keyword, setKeyword] = useState('');
    const [open, setOpen] = useState(false);
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

    function showDrawer(e) {
        e.preventDefault();
        const id = e.target.parentNode.id;
        console.log(id);
        if (id == '') {
          setCommand();
          isCreate = true;
          setOpen(true);
        } else {
          getCommand(id).then(result => {setCommand(result);
          console.log(result)
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
          title: 'Название команды',
          dataIndex: 'name',
          sorter: true,
          width: '15%',
          fixed: 'left',
          editable: true,
        },
        {
          title: 'Первый участник',
          dataIndex: 'userFirst',
          sorter: true,
          width: '20%',
        },
        {
          title: 'Второй участник',
          dataIndex: 'userSecond',
          width: '15%',
          sorter: true,
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
              <Popconfirm title="Хотите удалить?" onConfirm={() => handleDelete(record.id)}>
               <a>Удалить</a>
              </Popconfirm>
              </Space>
              </span>
            );
          },
        },
      ];

      async function getCommand(id) {
        return fetch(process.env.REACT_APP_COMMAND + `/${id}`, {
          method: 'GET',
          headers: {
              'Authorization' :'Bearer ' + localStorage.getItem('accessToken').replaceAll("\"", ""),
              'Content-Type': 'application/json;charset=utf-8'
          },
      }).then((res) =>  {
        if (res.status == 403) {
          localStorage.removeItem('accessToken');
          throw new Error ("Время сессии истекло")
        } else {
          return res.json();
        }
      }).then(res =>
      { if (res.error_message)
        {
          info (res.error_message);
        } else {
          return res;
        }
      }).catch((res) => {
        alert(res);
        refreshPage();
      });
      }

    const getCommands = (sort, userAuthors, wordKey, token) => {
        if (userAuthors == null) {
         userAuthors = '';
         }
       fetch(process.env.REACT_APP_COMMAND + 
       `?page=` + `${tableParams.pagination.current - 1}` + 
       `&size=` + `${tableParams.pagination.pageSize}` + 
       `${sort}` + 
       `${userAuthors}`+
       `${wordKey}`, {
         method: 'GET',
         credentials: "include",
         headers: {
             'Authorization' :'Bearer ' + token,
             'Content-Type': 'application/json;charset=utf-8'
         }
        })
         .then((res) =>  {
             return res.json();}
            )
         .then((results) => {
           if (results.error_message)
           {
             throw new Error (results.error_message);
           }
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
           alert(res.message);
           localStorage.removeItem('accessToken');
           refreshPage();
         });
     }

    useEffect(() => {
      fetchData();
   }, [JSON.stringify(tableParams), keyword]);


   const refreshPage = ()=>{
    window.location.reload();
 }

 const handleDelete = (id) => {
  const token = localStorage.getItem('accessToken').replaceAll("\"", "");
  fetch(process.env.REACT_APP_COMMAND + `/${id}`, {
    method: 'DELETE',
    headers: {
        'Authorization' :'Bearer ' + token,
    }
}).then(res => 
  {  if (res.status == 403) {
     throw new Error (res.json())}
     else {
      if (res.status == 200) {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        return {};
      }
      return res.json();
     }
  })
    .then(res =>
    {
      if (res.error_message)
      {
        info (res.error_message);
      } 
    }).catch((res) => {
      alert(res.error_message);
      localStorage.removeItem('accessToken');
      refreshPage();
    });
};


   const fetchData = () => {
    const {sort, userAuthors, wordKey, token} = getParams();
    getCommands(sort, userAuthors, wordKey, token);
  };

  const getParams = () => {
    const token = localStorage.getItem('accessToken').replaceAll("\"", "");
    let sort = '';
    if (tableParams.column) {
    let nameColumns = tableParams.column.dataIndex;
    let order = tableParams.order === 'ascend' ? '%2CASC' : '%2CDESC';
    sort = '&sort=' + nameColumns + order;
    }
    let authorArr = tableParams.filters;

    let userAuthors = null;
    if (authorArr) {
      const {author} = authorArr;
       userAuthors = ``
      for (let key in author) {
         userAuthors = userAuthors + `&userId=` + author[key];
      }
    }

    let wordKey = '';
    if (keyword) {
      wordKey = '&keyword=' + keyword;
    } 
   
    setLoading(true);
    return {sort, userAuthors, wordKey, token};
   }

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

   return (
    <div>
    {contextHolder}
    <CommandBar></CommandBar>
    <Form form={form} component={false}>
    <h1>Таблица команд обхода</h1>
    <Space direction="horizontal">
    <Space direction="vertical">
    <a>Поиск по ключевому слову</a>
    <AddKeyword keys={keyword} keywordChange = {setKeyword} fetch = {fetchData}/>
    </Space>
    </Space>
    <Button type='primary' onClick={showDrawer} style = {{float:'right'}}>Добавить комманду</Button>
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
      <Drawer title={`${isCreate ? 'Добавление' : 'Редактирование '} команды`} placement="right" onClose={onClose} open={open} destroyOnClose>
       <AddCommand data = {data} setData = {setData} refreshPage = {refreshPage} initialValue = {commandBase} isCreate = {isCreate} getSort = {getParams} getCommands = {getCommands}></AddCommand>
      </Drawer>
    </Form>
    </div>
  );

};

export default CommandTable;
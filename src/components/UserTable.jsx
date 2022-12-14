import { Form, Input, InputNumber, Popconfirm, Table, Drawer, Button, Image, Space, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AddKeyword from './AddKeyword';
import UsersBar from './UsersBar/UsersBar';
import AddUser from './AddUser/AddUser';

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

const UserTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [userBase, setUser] = useState();
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
  
    useEffect(() => {
      fetchData();
   }, [JSON.stringify(tableParams), keyword]);

   function showDrawer(e) {
    e.preventDefault();
    const id = e.target.parentNode.id;
    console.log(id);
    if (id == '') {
      setUser();
      isCreate = true;
      setOpen(true);
    } else {
      getUser(id).then(result => {setUser(result);
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
      title: '??????',
      dataIndex: 'firstName',
      sorter: true,
      width: '15%',
      fixed: 'left',
      editable: true,
    },
    {
      title: '??????????????',
      dataIndex: 'secondName',
      sorter: true,
      width: '20%',
    },
    {
      title: '??????????',
      dataIndex: 'username',
      width: '15%',
      sorter: true,
    },
    {
      title: '????????',
      dataIndex: 'role',
      sorter: true,
      width: '15%',
      render: (role) => `${role.name}`,
    },
    {
      title: '????????????????',
      width: '13%',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
          <Space direction="horizontal">
          <Button type="link" onClick={showDrawer} id = {record.id} >??????????????????????????</Button>
          <Popconfirm title="???????????? ???????????????" onConfirm={() => handleDelete(record.id)} >
           <a>??????????????</a>
          </Popconfirm>
          </Space>
          </span>
        );
      },
    },
  ];

  const refreshPage = ()=>{
    window.location.reload();
 }

  const getUsers = (sort, userAuthors, wordKey, token) => {
    if (userAuthors == null) {
     userAuthors = '';
     }
   fetch(process.env.REACT_APP_USER + 
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

       console.log(content);
          
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

 async function getUser(id) {
  return fetch(process.env.REACT_APP_USER + `/${id}`, {
    method: 'GET',
    headers: {
        'Authorization' :'Bearer ' + localStorage.getItem('accessToken').replaceAll("\"", ""),
        'Content-Type': 'application/json;charset=utf-8'
    },
}).then((res) =>  {
  if (res.status == 403) {
    localStorage.removeItem('accessToken');
    throw new Error ("?????????? ???????????? ??????????????")
  } else {
    return res.json();
  }
})
.then((results) => {
    return results;
}).catch((res) => {
  alert(res);
  refreshPage();
});
}

 const handleDelete = (id) => {
  const newData = data.filter((item) => item.id !== id);
  console.log(id);
  setData(newData);
  const token = localStorage.getItem('accessToken').replaceAll("\"", "");
  fetch(process.env.REACT_APP_USER + `/${id}`, {
    method: 'DELETE',
    headers: {
        'Authorization' :'Bearer ' + token,
    }
}).then(res => 
    {
      if (res.status == 403) {
        localStorage.removeItem('accessToken');
        throw new Error ("?????????? ???????????? ??????????????")
      } else {
        return;
      }
    }).catch((res) => {
      alert(res);
      refreshPage();
    });
};

   const fetchData = () => {
    const {sort, userAuthors, wordKey, token} = getParams();
    getUsers(sort, userAuthors, wordKey, token);
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

    return (
        <div>
        <UsersBar></UsersBar>
        <Form form={form} component={false}>
        <h1>?????????????? ??????????????????????????</h1>
        <Space direction="horizontal">
        <Space direction="vertical">
        <a>?????????? ???? ?????????????????? ??????????</a>
        <AddKeyword keys={keyword} keywordChange = {setKeyword} fetch = {fetchData}/>
        </Space>
        </Space>
        <Button type='primary' onClick={showDrawer} style = {{float:'right'}}>???????????????? ????????????????????????</Button>
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
          <Drawer title={`${isCreate ? '????????????????????' : '???????????????????????????? '} ????????????????????????`} placement="right" onClose={onClose} open={open} destroyOnClose>
           <AddUser data = {data} setData = {setData} refreshPage = {refreshPage} initialValue = {userBase} isCreate = {isCreate} getSort = {getParams} getUsers = {getUsers}></AddUser>
          </Drawer>
        </Form>
        </div>
      );
    };

    export default UserTable;
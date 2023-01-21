import { Form, Input, InputNumber, Popconfirm, Table, Drawer, Button, Image, Space, message } from 'antd';
import React, {useEffect, useState } from 'react';
import { getDetail } from '../fetchData';
import './SejsmTable.css';
import AddKeyword from './AddKeyword';
import AddDates from './AddDates';
import EditDetail from './Edit Detail/Edit Detail';
import Column from 'antd/es/table/Column';
import UploadPhoto from './UploadPhoto/UploadPhoto';
import MainBar from './MainBar/MainBar';

let isCreate = false;
let idPhoto;

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
  const [fAuthor, setFAuthor] = useState();
  const [fRoom, setfRoom] = useState();
  const [detailBase, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [dates, setDates] = useState('');
  const [open, setOpen] = useState(false);
  const [openPhoto, setOpenPhoto] = useState(false);
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
    setFilters();
 }, []);

  useEffect(() => {
    fetchData()
 }, [JSON.stringify(tableParams), keyword, dates]);
  
  function showPhoto(e) {
    e.preventDefault();
    idPhoto = e.target.parentNode.id;
    if (idPhoto) {
    setOpenPhoto(true);
    }
  }

  function showDrawer(e) {
    e.preventDefault();
    const id = e.target.parentNode.id;
    console.log(id);
    if (id == '') {
      setDetail();
      isCreate = true;
      setOpen(true);
    } else {
     getDetail(id, info).then(result => {setDetail(result);
      isCreate = false;
    setOpen(true);
    return result;
    });
     }
  };

  const onClose = () => {
    setOpen(false);
  };

  const closePhoto = () => {
    setOpenPhoto(false);
  };


  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    console.log(id);
    setData(newData);
    const token = localStorage.getItem('accessToken').replaceAll("\"", "");
    fetch(process.env.REACT_APP_DETAIL + `/${id}`, {
      method: 'DELETE',
      headers: {
          'Authorization' :'Bearer ' + token,
      }
  }).then(res => 
      {
        if (res.status == 403) {
          localStorage.removeItem('accessToken');
          throw new Error ("Время сессии истекло")
        } else {
          return;
        }
      }).catch((res) => {
        alert(res);
        refreshPage();
      });
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      sorter: true,
      width: '25%',
      fixed: 'left',
      editable: true,
    },
    {
      title: 'Дата обхода',
      dataIndex: 'roundDate',
      sorter: true,

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
      render: (author) => `${author.name}`,
      filters: fAuthor
    },
    {
      title: 'Помещение',
      dataIndex: 'room',
      sorter: true,
      render: (room) => `${room.name}`,
      filters: fRoom
    },
    {
      title: 'Высотная отметка',
      width: '7%',
      dataIndex: 'height',
    },
    {
      title: 'Операции',
      width: '10%',
      fixed: 'right',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
          <Space direction="vertical">
          <Button type="link" onClick={showDrawer} id = {record.id} >Редактировать</Button>
          <Popconfirm title="Хотите удалить?" onConfirm={() => handleDelete(record.id)} >
           <a>Удалить</a>
          </Popconfirm>
          <Button type="link" id = {record.id} onClick={showPhoto}>Фото</Button>
          </Space>
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
      }),
    };
  });

  const refreshPage = ()=>{
    window.location.reload();
 }

  const getDetails = (sort, userAuthors, rooms, wordKey, token, startTime, endTime) => {
     if (userAuthors == null) {
      userAuthors = '';
      }
      if (rooms == null) {
        rooms = '';
      }
    fetch(process.env.REACT_APP_DETAIL + 
    `?page=` + `${tableParams.pagination.current - 1}` + 
    `&size=` + `${tableParams.pagination.pageSize}` + 
    `${sort}` + 
    `${userAuthors}`+
    `${rooms}`+
    `${wordKey}`+
    `${startTime}`+
    `${endTime}`, {
      method: 'GET',
      credentials: "include",
      headers: {
          'Authorization' :'Bearer ' + token,
          'Content-Type': 'application/json;charset=utf-8'
      }
     })
      .then((res) =>  {
        setLoading(false);
          return res.json();}
         )
      .then((results) => {
        if (results.error_message)
        {
          throw new Error (results.error_message);
        }
        const {content} = results;

        setData(content);
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

  const getUsers = async () =>  {
    return fetch(process.env.REACT_APP_USER + `/filter` , {
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
          return res;
        })
        .catch((res) => {
          alert(res.error_message);
          localStorage.removeItem('accessToken');
          refreshPage();
      });
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
          return res;
        })
        .catch((res) => {
          alert(res.error_message);
          localStorage.removeItem('accessToken');
          refreshPage();
      });
  }

  const getSelectUsers = () => {
    getUsers().then(res => {
        let filterAuthor = [];
        for (let key in res) {
          filterAuthor.push({value: res[key].id, text: res[key].name})
        }
         setFAuthor(filterAuthor);
        });
   };

   const getSelectRoom = () => {
    getRooms().then(res => {
        let filterAuthor = [];
        for (let key in res) {
          filterAuthor.push({value: res[key].id, text: res[key].name})
        }
         setfRoom(filterAuthor);
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
    console.log(tableParams.filters)
    let authorArr;
    let roomArr;
    let userAuthors = null;
    let rooms = null;

    if (tableParams.filters) {
    if (tableParams.filters.author) {
    authorArr = tableParams.filters.author;

    if (authorArr) {
       userAuthors = ``
      for (let key in authorArr) {
         userAuthors = userAuthors + `&userId=` + authorArr[key];
      }
    }}

    if (tableParams.filters.room) {
    roomArr = tableParams.filters.room;

    if (roomArr) {
       rooms = ``
      for (let key in roomArr) {
         rooms = rooms + `&roomId=` + roomArr[key];
      }
    }}}

    let wordKey = '';
    if (keyword) {
      wordKey = '&keyword=' + keyword;
    } 

    let startTime = '';
    let endTime = '';

    if (dates) {
      console.log(dates)
    if (dates[0]) {
      
      let date = new Date(dates[0])
      let newDate = date.toISOString();
      console.log(newDate)
      startTime = '&startTime=' + newDate;
    }

    if (dates[1]) {
      let date = new Date(dates[1])
      let newDate = date.toISOString();
      endTime = '&endTime=' + newDate;
    }
  }
   
    setLoading(true);
    return {sort, userAuthors, rooms, wordKey, token, startTime, endTime};
   }

  const fetchData = () => {
    const {sort, userAuthors, rooms, wordKey, token, startTime, endTime} = getParams();
    getDetails(sort, userAuthors, rooms, wordKey, token, startTime, endTime);
  };

  const setFilters = () => {
    getSelectUsers();
    getSelectRoom();
  }

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
    <MainBar></MainBar>
    <Form form={form} component={false}>
    <h1>Таблица элементов</h1>
    <Space direction="horizontal">
    <Space direction="vertical">
    <a>Поиск по ключевому слову</a>
    <AddKeyword keys={keyword} keywordChange = {setKeyword}/>
    </Space>
    <Space direction="vertical">
    <a>Поиск по датам обхода</a>
    <AddDates dates = {dates} datesChange= {setDates}/>
    </Space>
    </Space>
    <Button type='primary' onClick={showDrawer} style = {{float:'right'}}>Добавить деталь</Button>
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
      size = {'middle'}
      rowClassName="editable-row"
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
      style ={{fontWeight : 600, fontSize : 26}}
      scroll={{x: 1500, y: 640}}
      
    />
      <Drawer title={`${isCreate ? 'Добавление' : 'Редактирование '} элемента`} placement="right" onClose={onClose} open={open} destroyOnClose>
       <EditDetail data = {data} setData = {setData} refreshPage = {refreshPage} initialValue = {detailBase} isCreate = {isCreate} getSort = {getParams} getDetails = {getDetails}></EditDetail>
      </Drawer>
      <Drawer title="Фотографии" placement="bottom" onClose={closePhoto} open={openPhoto} height = {500} destroyOnClose>
      <UploadPhoto idPhoto = {idPhoto}></UploadPhoto>
      </Drawer>
    </Form>
    </div>
  );
};

export default SejsmTable;

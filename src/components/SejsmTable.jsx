import { Form, Input, InputNumber, Popconfirm, Table, Drawer, Button, Image, Space } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './SejsmTable.css';
import AddKeyword from './AddKeyword';
import AddDates from './AddDates';
import EditDetail from './Edit Detail/Edit Detail';
import Column from 'antd/es/table/Column';
import UploadPhoto from './UploadPhoto/UploadPhoto';

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
  const [detailBase, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [openPhoto, setOpenPhoto] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
    },
  });
  
  function showPhoto(e) {
    e.preventDefault();
    idPhoto = e.target.parentNode.id;
    setOpenPhoto(true);
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
     getDetail(id).then(result => {setDetail(result);
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

  async function getDetail(id) {
    return fetch(`http://109.167.155.87:8080/detail/${id}`, {
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
    fetch(`http://109.167.155.87:8080/detail/${id}`, {
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
      fixed: 'left',
      editable: true,
    },
    {
      title: 'Дата обхода',
      dataIndex: 'roundDate',
      sorter: true,
      width: '20%',
    },
    {
      title: 'Дата записи',
      dataIndex: 'createDateTime',
      width: '15%',
      sorter: true,
    },
    {
      title: 'Автор',
      dataIndex: 'author',
      sorter: true,
      width: '15%',
      render: (author) => `${author.name}`,
      filters: fAuthor
    },
    {
      title: 'Операции',
      width: '13%',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
          <div>
          <Button type="link" onClick={showDrawer} id = {record.id} >Редактировать</Button>
          <Popconfirm title="Хотите удалить?" onConfirm={() => handleDelete(record.id)} >
          <a>Удалить</a>
          </Popconfirm>
          </div>
          <div>
          <Button type="link" id = {record.id} onClick={showPhoto}>Фото</Button>
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
      }),
    };
  });

  const refreshPage = ()=>{
    window.location.reload();
 }

  const getDetails = (sort, userAuthors, wordKey, token) => {
     if (userAuthors == null) {
      userAuthors = '';
      }
    fetch(`http://109.167.155.87:8080/detail` + 
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
        console.log(tableParams);
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
        let filterAuthor = [];
        let ourFilter = new Set();
        let nowFilter = [];

        for (let key in content) {
          filterAuthor.push({value: content[key].author.id, text: content[key].author.name})
        }
        filterAuthor.filter(item => !ourFilter.has(JSON.stringify(item)) ? ourFilter.add(JSON.stringify(item)) : false);
        const fArray = Array.from(ourFilter)
        for (let key in fArray) {
          nowFilter.push(JSON.parse(fArray[key]))
        }
        setFAuthor(nowFilter);

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
  }

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

  const fetchData = () => {
    const {sort, userAuthors, wordKey, token} = getParams();
    getDetails(sort, userAuthors, wordKey, token);
  };

  useEffect(() => {
    fetchData();
 }, [JSON.stringify(tableParams), keyword]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };


  return (
    <div>
    <Form form={form} component={false}>
    <Space direction="horizontal">
    <Space direction="vertical">
    <a>Поиск по ключевому слову</a>
    <AddKeyword keys={keyword} keywordChange = {setKeyword} fetch = {fetchData}/>
    </Space>
    <Space direction="vertical">
    <a>Поиск по датам обхода</a>
    <AddDates fetch = {fetchData}/>
    </Space>
    </Space>
    <Button type='primary' onClick={showDrawer}>Добавить деталь</Button>
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
      style ={{fontWeight : 600, fontSize : 16}}
      scroll={{
        x: 1500,
        y: 640,
      }}
      
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

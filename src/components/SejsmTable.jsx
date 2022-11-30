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
  const [fAuthor, setFAuthor] = useState();
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageSize: 10000,
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
    console.log(id);
    setData(newData);
    const token = localStorage.getItem('accessToken').replaceAll("\"", "");
    fetch(`http://localhost:8080/detail/${id}`, {
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
        const newItem = newData[index];
        const token = localStorage.getItem('accessToken').replaceAll("\"", "");
        fetch(`http://localhost:8080/detail/${newItem.id}`, {
          method: 'PUT',
          headers: {
              'Authorization' :'Bearer ' + token,
              'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(row)
      }).then((res) =>  {
        if (res.status == 403) {
          localStorage.removeItem('accessToken');
          throw new Error ("Время сессии истекло")
        } else {
          return res.json();
        }
      })
      .then((results) => {
        setData(newData);
        setEditingKey('');
        setLoading(false);
      }).catch((res) => {
        alert(res);
        refreshPage();
      }
      );
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
    let authorArr = tableParams.filters;

    console.log(tableParams);
    console.log(authorArr);
    let userAuthors = null;
    if (authorArr) {
      const {author} = authorArr;
       userAuthors = ``
      for (let key in author) {
         userAuthors = userAuthors + `&userId=` + author[key];
      }
      console.log(userAuthors);
    }
   
    setLoading(true);
    fetch(`http://localhost:8080/detail` + 
    `?page=` + `${tableParams.pagination.current - 1}` + 
    `&size=` + `${tableParams.pagination.pageSize}` + 
    `${sort}` + 
    `${userAuthors}`, {
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

        console.log(content)
           
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
        console.log(nowFilter);
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

  const keywordChange = (e) => {
     setKeyword(e.target.value);
    
  }

  return (
    <div>
    <AddDetail fetch = {fetchData} param = {tableParams}/>
    <Form form={form} component={false}>
      Поиск по ключевому слову
    <Input placeholder="Ключевое слово" style={{width: 200}} onChange = {keywordChange}/>
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
      scroll={{
        x: 1500,
        y: 640,
      }}
    />
    </Form>
    </div>
  );
};

export default SejsmTable;

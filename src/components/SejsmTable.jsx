import { Table } from 'antd';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
const columns = [
  {
    title: 'Название',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
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
  },
];
const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});
const SejsmTable = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      total: 100,
      current: 1,
      pageSize: 10,
    },
  });

  const refreshPage = ()=>{
    window.location.reload();
 }

  const fetchData = () => {
    console.log(tableParams)
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
        console.log(content)
        console.log(results)
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

    console.log(pagination);
    console.log(sorter);
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };
  return (
    <Table
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default SejsmTable;
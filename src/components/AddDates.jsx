import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {Input, DatePicker}  from 'antd';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es')

const { RangePicker } = DatePicker;

const AddDates = () => {
 
    const handleTableChange = (e) => {
        console.log(e[0]);
    //    let value = e.target.value;
     //   console.log(value);
      };

    return (
    <RangePicker format={'YYYY-MM-DD'} 
        prefix={<LockOutlined className="site-form-item-icon" />} onChange={handleTableChange}/>
    );
}

export default AddDates;
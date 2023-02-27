import React from "react";
import { LockOutlined } from '@ant-design/icons';
import {DatePicker}  from 'antd';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es')

const { RangePicker } = DatePicker;

const AddDates = (props) => {

    return (
    <RangePicker format={'YYYY-MM-DD'}
        prefix={<LockOutlined className="site-form-item-icon" />} value={props.dates} style={{width: 300}} onChange = {e => props.datesChange(e)}/>
    );
}

export default AddDates;
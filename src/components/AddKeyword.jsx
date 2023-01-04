import React from "react";
import {Input}  from 'antd';

const AddKeyword = (props) => {


    return (
    <Input placeholder="Ключевое слово" value={props.key} style={{width: 200}} onChange = {e => props.keywordChange(e.target.value)} ></Input>
    );
}

export default AddKeyword;
import React from "react";
import {Input}  from 'antd';

const AddKeyword = (props) => {

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(props.keys)
        props.keywordChange(e.target.value);
       // props.fetch();
      }
      
    return (
    <Input placeholder="Ключевое слово" value={props.key} style={{width: 200}} onChange = {e => props.keywordChange(e.target.value)} ></Input>
    );
}

export default AddKeyword;
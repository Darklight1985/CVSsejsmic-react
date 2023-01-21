import React, {useEffect, useState } from "react";
import {Input}  from 'antd';

const AddKeyword = (props) => {
    const [timer, setTimer] = useState(null);

    function changeDelay(change) {
        if (timer) {
          clearTimeout(timer);
          setTimer(null);
        }
        setTimer(
          setTimeout(() => {
            props.keywordChange(change);
          }, 200)
        );
    }

    return (
    <Input placeholder="Ключевое слово" value={props.key} style={{width: 200}} onChange = {e => changeDelay(e.target.value)} ></Input>
    );
}

export default AddKeyword;
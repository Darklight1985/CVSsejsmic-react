import { Button, Image } from "antd";
import React, { useState, useLayoutEffect, useEffect } from "react";
import EditDetail from "../Edit Detail/Edit Detail";


const UploadPhoto = ({idPhoto}) => {
    const [file, setFile] = useState();
    function handleChange(e) {
        console.log(e.target.files);
        console.log(typeof e.target.files[0]);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(() => {
        console.log(idPhoto);
        getDetail(idPhoto);
     }, []);

     function getDetail(idPhoto) {
        return fetch(`http://109.167.155.87:8080/detail/${idPhoto}`, {
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
          console.log(results.photo);
          let tableElem = document.getElementById('inputPhoto');
        //  setFile(URL.createObjectURL(results.photo));
          let photo = results.photo;
          console.log(window.location.origin);
         
          //tableElem.src = "./Edit Detail/baca8b33-172f-4576-a4a4-132c681be112.jpg";
         const resp = import(`./../../photos/${photo}`).then(res => setFile(res.default))
          return results;
      }).catch((res) => {
        alert(res);
       // refreshPage();
      });
    }



    const onFinish = () => {
        const token = localStorage.getItem('accessToken').replaceAll("\"", "");
        let tableElem = document.getElementById('inputPhoto');

        console.log(tableElem.files[0]);
        let data = new FormData();
        data.append('avatar', tableElem.files[0]);

        fetch(`http://109.167.155.87:8080/detail/${idPhoto}/add-avatar`, {
            method: 'POST',
            headers: {
                'Authorization' :'Bearer ' + token
            },
            body: data
        })
        .then((res) =>  {
            if (res.status == 403) {
              localStorage.removeItem('accessToken');
              throw new Error ("Время сессии истекло")
            } else {
              return res.json();
            }}).then(res=> {
              return res;
            }
            )
          .catch((res) => {
            alert(res);
            window.location.reload();
          });
      };
    
  
    return (
        <div className="App">
            <h2>Выбрать фото:</h2>
            <input type="file" onChange={handleChange} id = "inputPhoto"/>
            <Image width={200} src={file} />
            <Button type ='primary' onClick={onFinish} id ={idPhoto}>Сохранить фото</Button>
        </div>
  
    );
};

export default UploadPhoto;
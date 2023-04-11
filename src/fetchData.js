

export function getDetail(id, info) {
return getEntity(id, info, process.env.REACT_APP_DETAIL);
}

export function getCommand(id, info) {
return getEntity(id, info, process.env.REACT_APP_COMMAND);
}

export function getUser(id, info) {
return getEntity(id, info, process.env.REACT_APP_USER);
}

export function getRoom(id, info) {
  return getEntity(id, info, process.env.REACT_APP_ROOM);
}

export function getSystem(id, info) {
  return getEntity(id, info, process.env.REACT_APP_SYSTEM);
}

export function deleteUser(id, info, setData, data) {
  return deleteEntity(id, info ,setData, data, process.env.REACT_APP_USER);
}

export function deleteCommand(id, info, setData, data) {
  return deleteEntity(id, info ,setData, data, process.env.REACT_APP_COMMAND);
}

export function deleteDetail(id, info, setData, data) {
  return deleteEntity(id, info ,setData, data, process.env.REACT_APP_DETAIL);
}

export function deleteRoom(id, info, setData, data) {
  return deleteEntity(id, info ,setData, data, process.env.REACT_APP_ROOM);
}

export function deleteSystem(id, info, setData, data) {
  return deleteEntity(id, info ,setData, data, process.env.REACT_APP_SYSTEM);
}

export function getUsers(info) {;
  return getEntities(info, process.env.REACT_APP_USER + `/filter`);
}

export function getRoles(info) {;
  return getEntities(info, process.env.REACT_APP_USER + `/roles`);
}

export function getRooms(info) {
  return getEntities(info, process.env.REACT_APP_ROOM);
}

export function createDetail(data, setData, values, info) {
  return createEntity(data, setData, values, info, process.env.REACT_APP_DETAIL);
}

export function createRoom(data, setData, values, info) {
  return createEntity(data, setData, values, info, process.env.REACT_APP_ROOM);
}

export function createSystem(data, setData, values, info) {
  return createEntity(data, setData, values, info, process.env.REACT_APP_SYSTEM);
}

export function updateDetail(newData, index, id, values, setData, info) {
  return updateEntity(newData, index, id, values, setData, info, process.env.REACT_APP_DETAIL);
}

export function updateRoom(newData, index, id, values, setData, info) {
  return updateEntity(newData, index, id, values, setData, info, process.env.REACT_APP_ROOM);
}

export function updateSystem(newData, index, id, values, setData, info) {
  return updateEntity(newData, index, id, values, setData, info, process.env.REACT_APP_SYSTEM);
}


function getEntity(id, info, url) {
  return fetch(url + `/${id}`, {
    method: 'GET',
    headers: {
        'Authorization' :'Bearer ' + localStorage.getItem('accessToken').replaceAll("\"", ""),
    },
}).then((res) =>  {
  if (res.status >= 400 || res.status < 200) {
    console.log(res.body);
    let resd = res.body.getReader();
    resd.read().then(({done, value}) => {
        let stringOur = new TextDecoder().decode(value);
        if (stringOur instanceof Object) {
        let str = JSON.parse(stringOur).message;
        info(str);
        } else {
          info (stringOur);        
    }})
  }
  return res.json();
})
}

const deleteEntity = (id, info ,setData, data, url) => {
  const token = localStorage.getItem('accessToken').replaceAll("\"", "");
  fetch(url + `/${id}`, {
    method: 'DELETE',
    headers: {
        'Authorization' :'Bearer ' + token,
    }
}).then(res => 
  {  
    if (res.status >= 400 || res.status < 200) {
      console.log(res.body);
      let resd = res.body.getReader();
      resd.read().then(({done, value}) => {
          let stringOur = new TextDecoder().decode(value);
          if (stringOur instanceof Object) {
          let str = JSON.parse(stringOur).message;
          info(str);
          } else {
            info (stringOur);        
      }})
      } else {
      if (res.status === 200) {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        return {};
      }
     }
  })
};


const getEntities = async (info, url) =>  {
  return fetch(url , {
    method: 'GET',
    credentials: "include",
    headers: {
        'Authorization' :'Bearer ' + localStorage.getItem('accessToken').replaceAll("\"", ""),
        'Content-Type': 'application/json;charset=utf-8'
    }
   })
    .then((res) =>{
      if (res.status >= 400 || res.status < 200) {
        console.log(res.body);
        let resd = res.body.getReader();
        resd.read().then(({done, value}) => {
            let stringOur = new TextDecoder().decode(value);
            if (stringOur instanceof Object) {
            let str = JSON.parse(stringOur).message;
            info(str);
            } else {
              info (stringOur);        
        }})
      } 
        else {       
        return res.json();
      }
    })
      .then(res =>
        {
          if (res.error_message)
          {
            info (res.error_message);
            return {};
          } 
          return res;
        })
}

const createEntity = (data, setData, values, info, url) => {
fetch(url, {
  method: 'POST',
  headers: {
      'Authorization' :'Bearer ' + localStorage.getItem('accessToken').replaceAll("\"", ""),
      'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(values)
})
.then((res) =>  {
  if (res.status >= 400 || res.status < 200) {
    console.log(res);
    let resd = res.body.getReader();
    resd.read().then(({done, value}) => {
        let stringOur = new TextDecoder().decode(value);
        console.log(stringOur)
        if (stringOur instanceof Object) {
        let str = JSON.parse(stringOur).message;
        info(str);
        } else {
          info (stringOur);        
    }})
  } else {
    return res.json();
  }})
  .then(res=> {
    if (res) {
      console.log(res)
      const newData = [...data];
      newData.push(res);
      setData(newData);
      return res;
    }})
}

const updateEntity = (newData, index, id, values, setData, info, url) => {
fetch(url + `/${id}`, {
  method: 'PUT',
  headers: {
      'Authorization' :'Bearer ' + localStorage.getItem('accessToken').replaceAll("\"", ""),
      'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(values)
}).then((res) => {
  if (res.status >= 400 || res.status < 200) {
    console.log(res.body);
    let resd = res.body.getReader();
    resd.read().then(({done, value}) => {
        let stringOur = new TextDecoder().decode(value);
        if (stringOur instanceof Object) {
        let str = JSON.parse(stringOur).message;
        info(str);
        } else {
          info (stringOur);        
    }})
} else {
  return res.json();
}})
.then(res => {
      newData[index] = res;
      setData(newData);
})
}
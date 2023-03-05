

export function getDetail(id, info) {
return getEntity(id, info, process.env.REACT_APP_DETAIL);
}

export function getCommand(id, info) {
return getEntity(id, info, process.env.REACT_APP_COMMAND);
}

export function getUser(id, info) {
return getEntity(id, info, process.env.REACT_APP_USER);
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

export function getUsers(info) {;
  return getEntities(info, process.env.REACT_APP_USER + `/filter`);
}

export function getRooms(info) {
  return getEntities(info, process.env.REACT_APP_ROOM);
}

export function createDetail(data, setData, values, info) {
  return createEntity(data, setData, values, info, process.env.REACT_APP_DETAIL);
}


function getEntity(id, info, url) {
  return fetch(url + `/${id}`, {
    method: 'GET',
    headers: {
        'Authorization' :'Bearer ' + localStorage.getItem('accessToken').replaceAll("\"", ""),
    },
}).then((res) =>  {
  if (res.status == 403) {
    throw new Error ("Время сессии истекло")
  } else {
    if (res.status == 200) {
      return res.json();
    }
    return res.json();
  }
})
.then(res =>
{ if (res.error_message)
  {
    info (res.error_message);
  } else {
    return res;
  }
}).catch((res) => {
  alert(res.message);
  localStorage.removeItem('accessToken');
  window.location.reload();
});
}

const deleteEntity = (id, info ,setData, data, url) => {
  const token = localStorage.getItem('accessToken').replaceAll("\"", "");
  fetch(url + `/${id}`, {
    method: 'DELETE',
    headers: {
        'Authorization' :'Bearer ' + token,
    }
}).then(res => 
  {  if (res.status == 403) {
      return res.json(); }
     else {
      if (res.status == 200) {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        return {};
      }
      return res.json();
     }
  })
    .then(res =>
    {
      if (res.error_message)
      {
        info (res.error_message);
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
      if (res.status == 403) {
        throw new Error ("Время сессии истекло")
      } else {       
        return res.json();
      }})
      .then(res =>
        {
          if (res.error_message)
          {
            info (res.error_message);
            return {};
          } 
          return res;
        })
      .catch((res) => {
        alert(res.message);
        localStorage.removeItem('accessToken');
        window.location.reload();
    });
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
  if (res.status == 403) {
    throw new Error ("Время сессии истекло")
  } else {
    return res.json();
  }})
  .then(res=> {
     if (res.error_message) {
      info(res.error_message)
     } else {
      const newData = [...data];
      newData.push(res);
      setData(newData);
      return res;
     }
  })
.catch((res) => {
  alert(res.message);
  localStorage.removeItem('accessToken');
  window.location.reload();
});
}

export function updateDetail(newData, index, id, values, setData, info) {
  return updateEntity(newData, index, id, values, setData, info, process.env.REACT_APP_DETAIL);
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
if (res.status == 403) {
  throw new Error ("Время сессии истекло")
} else {
  return res.json();
}})
.then(res => {
  if (res.error_message) {
    info(res.error_message)
   } else {
      newData[index] = res;
      setData(newData);
   }
})
.catch((res) => {
alert(res.message);
localStorage.removeItem('accessToken');
window.location.reload();
}
);
}
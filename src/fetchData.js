
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
  alert(res);
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
     throw new Error (res.json())}
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
    }).catch((res) => {
      alert(res.error_message);
      localStorage.removeItem('accessToken');
      window.location.reload();
    });
};
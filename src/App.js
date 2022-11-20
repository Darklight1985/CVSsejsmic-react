import './App.css';
import React from 'react';
import { ReactDOM } from "react";
import { DatePicker, message } from 'antd';
import SejsmTable from './components/SejsmTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import useToken from './useToken';


function App() {

  const {token, setToken}  = useToken();

   if (!token) {
    return <Login setToken={setToken}/>
   }

  return (
    <div className="App">
      <h2>Таблица сейсмических элементов</h2>
      <Router>
        <Routes>
        <Route path="/" element={<SejsmTable/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

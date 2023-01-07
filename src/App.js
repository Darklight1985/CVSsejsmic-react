import './App.css';
import React from 'react';
import { useState } from 'react';
import { ReactDOM } from "react";
import { DatePicker, message } from 'antd';
import SejsmTable from './components/SejsmTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import useToken from './useToken';
import MainBar from './components/MainBar/MainBar';
import UserTable from './components/UserTable';


function App() {

  const {token, setToken}  = useToken();

   if (!token) {
    return <Login setToken={setToken}/>
   }

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<SejsmTable/>}/>
        <Route path="/users" element={<UserTable/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

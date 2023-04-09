import './App.css';
import React from 'react';
import SejsmTable from './components/SejsmTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import useToken from './useToken';
import UserTable from './components/UserTable';
import CommandTable from './components/CommandTable';
import RoomTable from './components/RoomTable';
import SystemTable from './components/SystemTable';


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
        <Route path="/commands" element={<CommandTable/>}/>
        <Route path="/rooms" element={<RoomTable/>}/>
        <Route path="/systems" element={<SystemTable/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

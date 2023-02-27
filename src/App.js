import './App.css';
import React from 'react';
import SejsmTable from './components/SejsmTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import useToken from './useToken';
import UserTable from './components/UserTable';
import CommandTable from './components/CommandTable';


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
        </Routes>
      </Router>
    </div>
  );
}

export default App;

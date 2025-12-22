import './App.css'
import { useState } from 'react'
import ListOrders from './ListOrders';
import ApiContext from './ApiContext';
import Register from './Register';
import Login from './Login';
import Activate from './Activate'
import Me from './Me';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  const apiUrl = "http://localhost:4000";
  const [apiKey, setApiKey] = useState(localStorage.getItem('token'));

  return (
    <ApiContext.Provider value={{ url: apiUrl, key: apiKey, setKey: setApiKey }}>
      <Router>
        <Routes>
          <Route path='/orders' element={<ListOrders />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/activate' element={<Activate />}></Route>
          <Route path='/' element={<Me />}></Route>
        </Routes>
      </Router>
    </ApiContext.Provider>
  )
}

export default App
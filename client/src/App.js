import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import UserLoginForm from './components/UserLoginForm'
import AdminLoginForm from './components/AdminLoginForm'
import UserSignUp from './components/UserSignUp'
import AdminSignUp from './components/AdminSignUp'
import UserHome from './components/UserHome'
import AdminHome from './components/AdminHome'
import NotFound from './components/NotFound'
import UserProtected from './components/UserProtected'
import AdminProtected from './components/AdminProtected'
import Open from './components/Open'

import './App.css'

const App = () => (
  
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Open/>} />
      <Route exact path="/userlogin" element={<UserLoginForm/>} />
      <Route exact path="/adminlogin" element={<AdminLoginForm/>} />
      <Route exact path="/usersign" element={<UserSignUp/>} />
      <Route exact path="/adminsign" element={<AdminSignUp/>} />
      <Route exact path="/userhome" element={<UserHome />} />
      <Route exact path="/adminhome" element={<AdminHome />} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  </BrowserRouter>
)

export default App
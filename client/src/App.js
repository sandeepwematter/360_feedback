import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Report from './pages/Report';
import Signup from './pages/SignUp';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/forgetpassword' element={<ForgetPassword />} />
      <Route path='/reset' element={<ResetPassword/>}/>
      <Route path='/' element={<Layout />}>
        <Route index element={<Dashboard />}/>
        <Route path='/report' element={<Report />}/>
      </Route>
    </Routes>
  )
}

export default App;

import React from "react"
// ✅ Correct
import { Route, Routes } from 'react-router-dom';
import Login from "./pages/Login"
import ResetPassword from "./pages/ResetPassword"
import Home from "./pages/Home"
import EmailVerify from "./pages/EmailVerify"
import { ToastContainer } from 'react-toastify';


function App() {


  return (
    <>
    <ToastContainer/>
   <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/email-verify' element={<EmailVerify />} />
    <Route path='/reset-password' element={<ResetPassword/>} />
   </Routes>
      
    </>
  )
}

export default App

import React, {  useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import {  AppContext } from '../context/AppContext';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';


const Login = () => {
  
  const [state,setState] = useState("Sign Up");
  const[name,setName] = useState("");
  const[password,setPassword] = useState("");
  const[email,setEmail] = useState("");
  const Navigate =useNavigate();

  const {backendURL , setIsLoggedIn } = useContext(AppContext);

  const onSubmitHandler = async(e)=>
  {
    try {
      e.preventDefault();
      axios.defaults.withCredentials =true;

      if(state == "Sign Up")
      {
           const {data} = await axios.post(backendURL +'/api/auth/register', {name,email,password} )
            if(data.success)
            {
                 setIsLoggedIn(true);
                 Navigate('/')
            }
            else{
                toast.error(data.message);
            }
      }
      else{
        const {data} = await axios.post(backendURL +'/api/auth/login', {email,password} )
        if(data.success)
        {
             setIsLoggedIn(true);
             
             Navigate('/')
        }
        else{
            toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


  
  return (
    <div className='flex items-center justify-center text-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
    <img 
    onClick={()=>Navigate('/')}
    className='absolute left-5 top-5 w-28 sm:w-32 cursor-pointer'
    src={assets.logo} alt="" />
    <div className=' bg-slate-900 w-full sm:w-96 p-10 rounded-lg text-indigo-200'>
       <h2 className='font-semibold text-3xl text-white'>{state=='Sign Up'?"Sign UP" : "Login" } </h2>
       <p className='m-2 text-white'>{state=='Sign Up'?"Create Your Account" : "Login in to Your Account" } </p>
       <form onSubmit={onSubmitHandler}>
       { state=='Sign Up' && <div className='w-full bg-[#333A5C] flex items-center  gap-3 px-4 py-1.5 border border-gray-400 rounded-full my-4'>
        <img src={assets.person_icon} alt="" />
          <input 
           onChange={(e)=>setName(e.target.value)}
           value={name}
          placeholder='Enter Your Name'
          className='bg-transparent outline-none '
           type="text" />
        </div>
        }
        <div className='w-full bg-[#333A5C] flex items-center gap-3 px-4 py-1.5 border border-gray-400 rounded-full my-4'>
        <img src={assets.mail_icon} alt="" />
          <input 
           onChange={(e)=>setEmail(e.target.value)}
           value={email}
          placeholder='Enter Your Email'
          className='bg-transparent outline-none '
           type="text" />
        </div>
        <div className='w-full bg-[#333A5C] flex items-center  gap-3 px-4 py-1.5 border border-gray-400 rounded-full my-4'>
        <img src={assets.lock_icon} alt="" />
          <input 
          onChange={(e)=>setPassword(e.target.value)}
          value={password}
          placeholder='Enter Your Password'
          className='bg-transparent outline-none '
           type="text" />
        </div>

        <p 
        onClick={()=>Navigate('/reset-password')}
        className='cursor-pointer text-white'> {state=="Sign Up"?'':'Forgot Password?' } </p>
        <button className='my-3 w-full bg-gradient-to-r from-indigo-500 to-indigo-900 px-8 py-2 rounded-full'>
        {state=="Sign Up"?'Sign Up':'Login' } 
        </button>

         {
          state=="Sign Up"?
          <>
          <p>Already have an account?{' '}
        <span
        onClick={()=> setState('login')}
         className='cursor-pointer  underline'>Login here</span>
        </p>

          </>
          :<>
          <p>Don't have an account?{' '}
        <span
         onClick={ ()=>setState('Sign Up')}
         className='cursor-pointer underline' >Sign up here</span>
        </p>
          </>
         }
        
       </form>
    </div>
      
    </div>
  )
}

export default Login

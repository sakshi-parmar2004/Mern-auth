import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const EmailVerify = () => {
   axios.defaults.withCredentials=true;
  const Navigate = useNavigate();
  
  
  const {backendURL ,isLoggedIn, userData, getUserData} = useContext(AppContext);
  const inputRefs = React.useRef([]);
  // const sendVerficationOtpEmail = async()=>
  //  {
  //     try {
  
  //         const {data} = await axios.post(backendURL + '/api/auth/send-verify-otp')
  //         if(data.success)
  //         {
  //           toast.success(data.message)
  //         }
  //         else{
  //           toast.error(data.message)
  //         }
        
  //     } catch (error) {
  //       toast.error(error.message)
  //     }
  //  }


 const verifyEmail = async(e)=>
 {
          try {
            e.preventDefault();
            const otpArray = inputRefs.current.map(e=> e.value)
            const otp = otpArray.join('')
            // console.log(otp)
            const {data} = await axios.post(backendURL +'/api/auth/verify-otp',{otp} );  
            // console.log("verification",data)
            if(data.success)
            {
               toast.success(data.message)
              //  console.log("Before calling getUserData");
              //  await getUserData(); // Ensure this is awaited if it's asynchronous
              //  console.log("After calling getUserData");
               Navigate('/')
            }
            else
            {
             toast.error(data.message)
            }
            
          } catch (error) {
            toast.error(error.mesage);
          }
 }
//  const handleResendEmail = () => {
//   // Logic to resend the verification email
//   sendVerficationOtpEmail();
//   console.log("Resend verification email clicked");

// };

 const handleInput = (e,index) =>
 {
    if(e.target.value.length >0 && index < inputRefs.current.length -1 )
    {
         inputRefs.current[index + 1].focus();
    }
 }

 const handleKeyDown = (e,index)=>
 {
  if(e.key == 'Backspace' &&  e.target.value === '' && index>0 )
  {
    inputRefs.current[index-1].focus();
  }

 }

const handlePaste = (e) => {
  e.preventDefault();
  const paste = e.clipboardData.getData('text').slice(0, 5); // Get the first 5 characters from the clipboard
  const pasteArray = paste.split('');

  pasteArray.forEach((char, index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].value = char;
     
      }}
    )

    }
  

    useEffect(() => {
      isLoggedIn && userData && userData.isAccountVerified && Navigate('/');
    }, [isLoggedIn, userData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
        <img 
        onClick={()=>Navigate('/')}
        className='absolute left-5 top-5 w-28 sm:w-32 cursor-pointer'
        src={assets.logo} alt="" />
      <form
      onSubmit={
        verifyEmail
      }
       className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-600 text-center mb-6">
          A verification email has been sent to your registered email address. Please check your inbox and enter here.
        </p>
          
<div className='flex justify-between' 
 onPaste={handlePaste}>
{
            
            Array(5).fill(0).map((_,index)=>
            (
              <input
          className='w-12 h-12 text-center text-black  rounded-md bg-gray-200 border border-gray-600'
           type="text"
           maxLength={1}
           ref={e=>inputRefs.current[index] =e}
           key={index}
           onInput={(e)=> handleInput(e,index)}
           onKeyDown={(e)=>handleKeyDown(e,index)}
           
           />

            ))
          }
</div>
          
         
        
         <div className='flex flex-col items-center'>
         <button
          type="submit"
          className='w-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg
           hover:bg-blue-600 transition-all my-4 cursor-pointer'>
            Verify
          </button>
         
        {/* <button
          type="button"
          onClick={handleResendEmail}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
        >
          Resend Verification Email
        </button> */}
         </div>
      </form>
    </div>
  );
};

export default EmailVerify;
import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const Navigate = useNavigate();
  const { userData, backendURL, setUserData, setIsLoggedIn } = useContext(AppContext);
  
  
  const Logout = async()=>
  {
    try {
       axios.defaults.withCredentials= true;
       const {data} = await axios.post(backendURL + '/api/auth/logout')
       data.success && setIsLoggedIn(false)
       data.success && setUserData(false);
       Navigate('/')

    } catch (error) {
      toast.error(error.message);
    }

  }
 const sendVerficationOtpEmail = async()=>
 {
    try {

        const {data} = await axios.post(backendURL + '/api/auth/send-verify-otp')
        if(data.success)
        {
          Navigate('/email-verify')
          toast.success(data.message)
        }
        else{
          toast.error(data.message)
        }
      
    } catch (error) {
      toast.error(error.message)
    }
 }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        onClick={() => Navigate("/")}
        src={assets.logo}
        alt=""
        className="w-28 sm:w-32 cursor-pointer"
      />
    
      {userData ? (
       
       <div className="w-8 h-8 rounded-full bg-black text-white flex justify-center items-center relative group">
    {   String(userData.name)[0].toUpperCase()}

      <div className="absolute hidden group-hover:block top-0 right-0 z-10 pt-10 rounded text-black">
        <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
        {
          !userData.isAccountVerfied && <li
          onClick={sendVerficationOtpEmail}
           className="py-1 px-2 hover:bg-gray-200 cursor-pointer"> Verify email</li>

        }
          <li onClick={Logout}
           className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Logout</li>
        </ul>
      </div>
       </div>
        

      ) : (
        <button
          onClick={() => Navigate("/login")}
          className="flex items-center gap-2 px-6 py-2 hover:bg-gray-100 transition-all
       cursor-pointer border border-gray-400 rounded-full"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;

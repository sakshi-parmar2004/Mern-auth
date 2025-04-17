import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props)=>
{
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const[ isLoggedIn, setIsLoggedIn] = useState(false);
    const[ userData, setUserData] = useState(false);



    const getAuthState= async()=>
    {
        axios.defaults.withCredentials =true
        try {
            const { data } = await axios.get(backendURL + '/api/auth/is-auth');
             console.log("Auth State Response:", data); // Debugging response
           
            if(data.success)
            {
                setIsLoggedIn(true);
                getUserData();
            }
            else{
                console.log( "The error is idk ", data);
                toast.error(data.message);
            }
           
        } catch (error) {
            toast.error(error.message);
        }
    }

     const getUserData = async () => {
        try {

            const { data } = await axios.get(backendURL+'/api/user/data')
            console.log("User State Response:", data);
            data.success ? setUserData(data.userData): toast.error(data.message);
            console.log("User Response from backend:", data.userData);

        
        } catch (error) {
            toast.error(error.message);
        }
        
    }

    useEffect(()=>
    {
        getAuthState();
    },[]);


    const value ={
               backendURL,
               isLoggedIn,setIsLoggedIn,
               userData,setUserData,
    }


    return( <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)

}

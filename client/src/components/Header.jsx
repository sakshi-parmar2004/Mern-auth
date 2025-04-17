import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {

   const {userData} = useContext(AppContext)

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center'>
      <img 
        className='w-36 h-36 rounded-full mb-6'
        src={assets.header_img} 
        alt="User Avatar" 
      />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl'>
        Hey {userData ? userData.name.toUpperCase() : "Developer"}
        <img
          className='w-8 aspect-square'
          src={assets.hand_wave} 
          alt="Wave Icon" 
        />
      </h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
        Welcome to our App
      </h2>
      <p className='mb-8 max-w-md'>
        Discover amazing features and enhance your experience with our platform. Join us and explore the possibilities!
      </p>
      <button className='border border-gray-400 rounded-full px-8 py-2 hover:bg-gray-400 transition-all'>
        Get Started
      </button>
    </div>
  )
}

export default Header

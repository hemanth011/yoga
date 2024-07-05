import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../compounts/header/Navbar'

const MainLayout = () => {
  return (
    <main className="dark:bg-black overflow-hidden">
       <Navbar/>
        <Outlet/>
        <footer>footer</footer>
    </main>
  )
}

export default MainLayout
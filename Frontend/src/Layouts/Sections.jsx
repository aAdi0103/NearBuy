import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Navbar from '../Layouts/Navbar'
const Sections = () => {
  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 bg-zinc-100 px-4 py-7 sm:px-6 lg:px-8">
        <h1 className="font-mono text-4xl text-center max-md:2xl font-bold">What are you looking for?</h1>
        <nav className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:space-x-6">
  <NavLink
    to="/sections/product"
    className={({ isActive }) =>
      `relative rounded-xl px-10 py-5 text-2xl font-extrabold transition-all duration-300 shadow-md 
      ${isActive ? 
        'scale-110 bg-black text-white shadow-lg ring-2 ring-gray-500'
        : 'bg-black text-white hover:scale-105 hover:bg-opacity-80 hover:shadow-lg hover:ring-2 hover:ring-gray-400'}` 
    }
  >
    Products
  </NavLink>
  <NavLink
    to="/sections/services"
    className={({ isActive }) =>
      `relative rounded-xl px-10 py-5 text-2xl font-extrabold transition-all duration-300 shadow-md 
      ${isActive ? 
        'scale-110 bg-black text-white shadow-lg ring-2 ring-gray-500'
        : 'bg-black text-white hover:scale-105 hover:bg-opacity-80 hover:shadow-lg hover:ring-2 hover:ring-gray-400'}` 
    }
  >
    Services
  </NavLink>
</nav>




        {/* Render the selected component below */}
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Sections

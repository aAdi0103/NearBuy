import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Navbar from '../Layouts/Navbar'
const Sections = () => {
  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 bg-zinc-100 px-4 py-7 sm:px-6 lg:px-8">
        <h1 className="font-mono text-4xl font-bold">What are you looking for?</h1>
        <nav className="flex flex-col items-center justify-center gap-6 space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
          <NavLink
            to="/sections/product"
            className={({ isActive }) =>
              `rounded-lg px-8 py-4 text-2xl font-extrabold transition-all duration-300 ${
                isActive
                  ? 'scale-125 bg-blue-600 text-white shadow-lg'
                  : 'bg-yellow-300 text-gray-700 hover:scale-105 hover:bg-blue-500 hover:text-white'
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/sections/services"
            className={({ isActive }) =>
              `rounded-lg px-8 py-4 text-2xl font-extrabold transition-all duration-300 ${
                isActive
                  ? 'scale-125 bg-blue-600 text-white shadow-lg'
                  : 'bg-yellow-300 text-gray-700 hover:scale-105 hover:bg-blue-500 hover:text-white'
              }`
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

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from '../Layouts/Navbar'
const Sections = () => {
  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 bg-zinc-100 flex items-center justify-center gap-4 flex-col">
      <h1 className="font-bold text-4xl font-mono">What are you looking for?</h1>
      <nav className="flex flex-col gap-6 sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <NavLink
          to="/sections/product"
          className={({ isActive }) =>
            `px-8 py-4 text-2xl font-extrabold rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg scale-125"
                : "bg-yellow-300 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105"
            }`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/sections/services"
          className={({ isActive }) =>
            `px-8 py-4 text-2xl font-extrabold rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg scale-125"
                : "bg-yellow-300 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105"
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
  );
};

export default Sections;

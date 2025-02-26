import React from 'react';
import { NavLink } from 'react-router-dom';

const Sections = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
        <NavLink
          to="/product"
          className={({ isActive }) =>
            `text-lg font-bold relative pb-2 transition-colors duration-200 ${
              isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            } after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 ${
              isActive ? 'after:scale-x-100' : ''
            }`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            `text-lg font-bold relative pb-2 transition-colors duration-200 ${
              isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            } after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 ${
              isActive ? 'after:scale-x-100' : ''
            }`
          }
        >
          Services
        </NavLink>
      </nav>
    </div>
  );
};

export default Sections;
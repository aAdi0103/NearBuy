import React, { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-blue-600 text-xl font-bold">LocalHub</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-gray-600 mr-3">
              <MapPin className="w-4 h-4 mr-1"/>
              <span>New York</span>
            </div>
            <button className="text-black font-mono bg-blue-500 px-4 py-2 rounded-md hover:text-gray-900">Sign In / Sign Up</button>
            <button className="bg-yellow-600 font-mono text-white px-4 py-2 rounded-md hover:bg-blue-700">
              List Services/Items
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>New York</span>
              </div>
              <button className="text-gray-600 hover:text-gray-900">Sign In</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                List Service/Item
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
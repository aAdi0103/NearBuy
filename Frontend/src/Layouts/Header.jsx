import React from 'react';
import { Search, MapPin } from 'lucide-react';

const Header = () => {
  return (
    <div 
      className="relative bg-cover bg-center bg-no-repea py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521790797524-b2497295b8a0?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      {/* Overlay to make text more readable */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          Discover Local Services & Goods
        </h2>
        <p className="text-lg mb-8 text-white">
          Connect with trusted local providers in your neighborhood
        </p>
        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-md p-2 flex flex-col sm:flex-row gap-2 relative">
          <div className="flex-1 flex items-center border rounded-md px-3 py-2">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="What service or Product are you looking for?"
              className="w-full focus:outline-none"
            />
          </div>
          <div className="flex-1 flex items-center border rounded-md px-3 py-2">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Location"
              className="w-full focus:outline-none"
            />
          </div>
          <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;

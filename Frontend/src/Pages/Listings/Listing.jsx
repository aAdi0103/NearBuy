import React from "react";

function Listing() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          What do you want to list?
        </h1>
        <div className="flex flex-col gap-4">
          {/* Services Button */}
          <a
            href="/list/Services"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center"
          >
            List Services
          </a>

          {/* Products Button */}
          <a
            href="/list/Products"
            className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium text-lg shadow-md hover:bg-green-700 transition flex items-center justify-center"
          >
            List Products
          </a>
        </div>
      </div>
    </div>
  );
}

export default Listing;

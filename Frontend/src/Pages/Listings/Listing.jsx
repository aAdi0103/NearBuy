import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {
	FaArrowLeft,
  } from 'react-icons/fa'
function Listing() {
	const navigate = useNavigate()
  return (
    <>
    <button
                onClick={() => navigate(-1)}
                className="text-black-700 absolute left-5 top-4 flex items-center transition-all hover:text-blue-900"
              >
                <FaArrowLeft className="text-md mr-2" /> <span className="font-medium">Back</span>
              </button>
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">What do you want to list?</h1>
        <div className="flex flex-col gap-4">
          {/* Services Button */}
          <Link
            to="/list/Services"
            className="flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-lg font-medium text-white shadow-md transition hover:bg-green-700"
          >
            List Services
          </Link>

          {/* Products Button */}
          <Link
            to="/list/Products"
            className="flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-lg font-medium text-white shadow-md transition hover:bg-green-700"
          >
            List Products
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default Listing

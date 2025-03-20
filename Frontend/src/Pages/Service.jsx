import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import { useState } from 'react'
import Navbar from '../Layouts/Navbar'
import { FaArrowLeft } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'

const Service = () => {
  const navigate = useNavigate()

  // Fetch Auth User
  const { data: authUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me')
        return res.data
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null
        }
        toast.error(err.response.data.message || 'Something went wrong')
      }
    },
  })

  // Fetch All Services
  const {
    data: services,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await axiosInstance.get('/services/getAllServices')
      return res.data
    },
  })

  // State to Track Selected Category
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Function to Handle Category Selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  // Filtered Services
  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services?.filter(
          (service) => service.category.toLowerCase() === selectedCategory.toLowerCase()
        )

  if (isLoading) return <div className="text-center text-lg font-semibold">Loading...</div>
  if (error) return <div className="text-center text-lg text-red-500">Failed to load services</div>

  return (
    <>
      <div className="mx-auto flex w-screen min-w-full gap-6 p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-black-700 absolute left-5 top-10 flex items-center text-xl transition-all hover:text-blue-900"
        >
          <FaArrowLeft className="text-md mr-2" /> <span className="font-medium">Back</span>
        </button>

        {/* Sidebar - Filters */}
        <div className="hidden h-[95vh] w-1/4 rounded-lg bg-zinc-200 p-4 shadow-md md:block">
          <h2 className="mb-3 text-lg font-bold">Filters</h2>

          <div>
            <label className="mb-2 block text-[1.5vw] font-semibold">Location</label>
            <select className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option className="px-2">All</option>
              <option>All of {authUser?.location.city}</option>
            </select>
          </div>

          {/* Category */}
          <div className="mt-4">
            <label className="block text-[1.5vw] font-semibold text-gray-800">Category</label>
            <div className="mt-3 space-y-3">
              {[
                { value: 'all', label: 'All Categories' },
                { value: 'fitness', label: 'Fitness' },
                { value: 'business', label: 'Business' },
                { value: 'education', label: 'Education' },
                { value: 'IT', label: 'IT' },
                { value: 'photography', label: 'Photography' },
                { value: 'others', label: 'Others' },
              ].map((category) => (
                <label
                  key={category.value}
                  className="flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition duration-200 ease-in-out hover:bg-blue-100"
                >
                  <input
                    type="checkbox"
                    value={category.value}
                    checked={selectedCategory.includes(category.value)}
                    onChange={(e) => handleCategoryChange(category.value)}
                    className="form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-md text-gray-700">{category.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full flex-1">
          {/* Services Grid */}
          {filteredServices?.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <a
                  key={service._id}
                  href={`/service/${service._id}`}
                  className="block w-full overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:shadow-lg"
                >
                  <img
                    src={service.images}
                    alt={service.title}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {service.location.city}, {service.location.state}
                    </p>
                    <p>{service.category}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        ₹{service.price}/{' '}
                        <span className="text-xs text-black">{service.duration}</span>{' '}
                      </span>
                      <button className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
                        Book Now
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center text-lg font-medium text-gray-500">
              No products found for your query.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Service

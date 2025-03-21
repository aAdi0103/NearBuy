import { useLocation, useNavigate } from 'react-router-dom'
import {
  FaBox,
  FaMapMarkerAlt,
  FaArrowLeft,
} from 'react-icons/fa'

const SearchedServices = () => {
  const location = useLocation()
  const allProducts = location.state?.data || []
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="relative mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-black-700 absolute max-md:left-0 left-5 max-md:top-[-7vw] flex items-center transition-all hover:text-blue-900"
        >
          <FaArrowLeft className="text-md mr-2" /> <span className="font-medium">Back</span>
        </button>

        {/* Page Title */}
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-700">Searc Results</h1>

        {/* No Services Found Message */}
        {allProducts.length === 0 ? (
          <p className="text-center text-xl mt-48 text-gray-600">Nothing found for your query.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {allProducts.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                {/* Product Image */}
                <img src={product.images} alt={product.title} className="h-40 w-full object-cover" />

                {/* Product Details */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
                  <p className="text-sm text-gray-500">{product.category}</p>

                  {/* Product Features */}
                  <div className="mt-3 space-y-2">
                    <p className="flex items-center text-xl font-bold text-black">
                      💰 ₹{product.price}/ <span className="mt-2 text-sm opacity-65">{product.duration}</span>
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FaBox className="mr-2 text-green-600" /> {product.experience}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-red-600" />
                      {product.location.area}, {product.location.city}
                    </p>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4 flex items-center justify-end">
                    <button className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                      <a href={`/service/${product._id}`}>
                        View Details
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchedServices
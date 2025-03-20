import { useLocation, useNavigate } from 'react-router-dom'
import {
  FaClock,
  FaTag,
  FaBox,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaStar,
  FaUser,
  FaArrowLeft,
} from 'react-icons/fa'

const ViewAllProducts = () => {
  const location = useLocation()
  const allProducts = location.state?.allProducts || []
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="relative mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-black-700 absolute left-5 top-0 flex items-center transition-all hover:text-blue-900"
        >
          <FaArrowLeft className="text-md mr-2" /> <span className="font-medium">Back</span>
        </button>

        {/* Page Title */}
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-700">Explore products</h1>
        <p className="mb-8 text-center text-gray-600">Find the Products within your area.</p>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allProducts.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
            >
              {/* product Image */}
              <img
                src={product.images}
                alt={product.heading}
                className="h-40 w-full object-cover"
              />

              {/* product Details */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.heading}</h2>
                <p className="text-sm text-gray-500">{product.category}</p>

                {/* product Features */}
                <div className="mt-3 space-y-2">
                  <p className="flex items-center font-bold text-gray-600">💰 ₹{product.price}</p>
                  <p className="flex items-center text-gray-600">
                    <FaTag className="mr-2 text-green-600" /> {product.condition}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaBox className="mr-2 text-green-600" /> {product.quantity}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-red-600" />
                    {product.location.area}, {product.location.city}
                  </p>
                </div>

                {/* Ratings & Booking */}
                <div className="mt-4 flex items-center justify-end">
                  <button className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ViewAllProducts

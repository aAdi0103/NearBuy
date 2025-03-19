import { useLocation, useNavigate } from "react-router-dom";
import { FaClock,FaTag, FaBox, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaUser, FaArrowLeft } from "react-icons/fa";

const SearchedServices = () => {
  const location = useLocation();
  const allProducts = location.state?.data || [];
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-0 left-5 flex items-center text-black-700 hover:text-blue-900 transition-all"
        >
          <FaArrowLeft className="mr-2 text-md" /> <span className="font-medium">Back</span>
        </button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">Searched Services</h1>
        
        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <div key={product._id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* product Image */}
              <img
                src={product.images}
                alt={product.title}
                className="w-full h-40 object-cover"
              />

              {/* product Details */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
                <p className="text-sm text-gray-500">{product.category}</p>

                {/* product Features */}
                <div className="mt-3 space-y-2">
                  <p className="flex items-center  text-xl font-bold text-black">
                  💰 ₹{product.price}/ <span className="text-sm mt-2 opacity-65">{product.duration}</span>
                  </p>
                
<p className="flex items-center text-gray-600">
  <FaBox className="text-green-600 mr-2" /> {product.experience}
</p>
                  <p className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="text-red-600 mr-2" />
                    {product.location.area}, {product.location.city}
                  </p>
                </div>

                {/* Ratings & Booking */}
                <div className="mt-4 flex justify-end items-center">
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchedServices;

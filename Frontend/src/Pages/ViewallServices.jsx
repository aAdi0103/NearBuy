import { useLocation, useNavigate } from "react-router-dom";
import { FaClock, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaUser, FaArrowLeft } from "react-icons/fa";

const ViewallServices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { Allservices } = location.state || { Allservices: [] };

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
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">Explore Services</h1>
        <p className="text-gray-600 text-center mb-8">
          Find the best services tailored to your needs within your area.
        </p>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Allservices.map((service) => (
            <div key={service._id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Service Image */}
              <img
                src={service.images}
                alt={service.title}
                className="w-full h-40 object-cover"
              />

              {/* Service Details */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{service.title}</h2>
                <p className="text-sm text-gray-500">{service.category}</p>

                {/* Service Features */}
                <div className="mt-3 space-y-2">
                  <p className="flex items-center font-bold text-gray-600">
                  💰 ₹{service.price}/ <span className="font-medium mt-1 text-sm">{service.duration}</span>
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaUser className="text-green-600 mr-2" /> {service.experience}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="text-red-600 mr-2" />
                    {service.location.area}, {service.location.city}
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

export default ViewallServices;

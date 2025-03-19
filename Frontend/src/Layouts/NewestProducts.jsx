import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const NewestProducts = ({userLocation, setUserLocation }) => {

  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [allProducts,setAllProducts] = useState([]);
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          return null;
        }
        toast.error(err.response?.data?.message || "Something went wrong");
        return null;
      }
    },
    staleTime: 60000, // Cache for 1 min to prevent excessive API calls
  });
  
  useEffect(() => {
    if (isLoading || authUser === undefined) return; // Wait until authUser is available
  
    let lat, lng;
  
    if (userLocation) {
      lat = userLocation.lat;
      lng = userLocation.lng;
    } else if (authUser?.latitude && authUser?.longitude) {
      lat = authUser.latitude;
      lng = authUser.longitude;
    }
    if (!lat || !lng) return; // Prevent unnecessary API calls
    
    setLoading(true);
    setError(null);
  
    axiosInstance
      .get(`/posts/current/nearby?lat=${lat}&lng=${lng}&radius=15`)
      .then((res) => {
        const data = res.data || [];
        setAllProducts(data);
        setproducts(Array.isArray(data) ? data.slice(-4) : []);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  
  }, [authUser, userLocation]); // Runs when authUser or userLocation updates
  const requestLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location access denied. Please enable location products.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="max-w-7xl mt-20 mx-auto sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          {authUser?.location?.city ? ` Explore Products near you ` : "Explore Products near you "}
        </h2>

        <Link
          to="/viewall/Products"
          state={{ allProducts }}
          className="text-blue-700 font-semibold flex items-center"
        >
          View All <ArrowRight className="ml-1" size={18} />
        </Link>
      </div>

      {loading && <p className="text-gray-600">Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!authUser && !userLocation ? (
        <div className="text-center mt-10">
          <p className="text-gray-600 text-lg mb-4">
            Please <span className="font-semibold">sign in</span> or{" "}
            <span className="font-semibold">allow location</span> to see products near you.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign In
            </button>
            <button
              onClick={requestLocationAccess}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Allow Location
            </button>
          </div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
            key={product._id}
            className="bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform duration-300"
          >
            {/* Image Section */}
            <img
              src={product.images || "https://via.placeholder.com/300"}
              alt={product.heading}
              className="w-full h-48 object-cover rounded-md"
            />
          
            {/* Service Details */}
            <div className="mt-3">
              <h3 className="text-xl font-bold text-gray-800">{product.heading}</h3>
          
              {/* Price */}
              <p className="text-lg font-semibold text-blue-600 flex items-center mt-1">
                💰 {product.price ? `₹ ${product.price}` : "Price Not Available"}
              </p>
              <p className="text-base font-meduim text-black flex items-center mt-1">
                Condition : {product.condition ? `${product.condition}` : "Price Not Available"}
              </p>
          
           
              {/* Location */}
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                📍 {product.location.area || "Location Not Available"} {product.location.city}
              </p>
          
              {/* View Details Button */}
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                <a href={`/product/${product._id}`} className="block text-center">View Details</a>
              </button>
            </div>
          </div>
          
          ))}
        </div>
      ) : (
        !loading && <p className="text-zinc-400">No products found nearby. Please update your location to see relevant products.</p>
      )}
    </div>
  );
};

export default NewestProducts;

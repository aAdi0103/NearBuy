import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaCheckCircle, FaStar } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();

    const { data: authUser } = useQuery({
      queryKey: ["authUser"],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get("/auth/me");
          return res.data;
        } catch (err) {
          if (err.response && err.response.status === 401) {
            return null;
          }
          toast.error(err.response.data.message || "Something went wrong");
        }
      },
    });

  const { data: product, error, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    },
    enabled: !!id,
    onError: (err) => console.error("Error fetching product details:", err),
  });

  if (isLoading) return <p className="text-center text-gray-600">Loading product details...</p>;
  if (error) return <p className="text-center text-red-500">Error loading product</p>;

  return (
    <>

<div className="flex space-x-4 items-center bg-white p-4 rounded-lg shadow-md">
      <h1 className="font-bold underline">Posted By :</h1>
      <a className="flex gap-4" href={`/profile/${authUser.email}`}>
      <img
        src={authUser.profilePic}
        alt={authUser.name}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* authUser Details */}
      <div className="flex-1">
        <div className="flex items-center space-x-1">
          <h2 className="text-lg font-semibold">{authUser.name}</h2>
        </div>
        <p className="text-gray-600 flex items-center text-sm">
          <FaMapMarkerAlt className="mr-1 text-gray-500" />
          {authUser.location.city}
        </p>
      </div>
      </a>
      
    </div>



    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Product Image */}
      <div className="md:col-span-2">
        <div className="relative">
          <img
            className="w-full h-80 object-cover rounded-lg"
            src={product.images || "/placeholder.jpg"}  // Use product.images directly
            alt={product.title || "Product Image"}
          />
        </div>
      </div>

      {/* Product Details */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{product.title || "Product Title"}</h2>
        <p className="text-gray-600 text-sm">By: {authUser.name || "Unknown Seller"}</p>

        <div className="mt-4">
          <p className="text-2xl font-bold text-blue-600">₹{product.price || "N/A"}</p>
          <p className="text-gray-600 text-sm"><strong>Condition:</strong> {product.condition || "N/A"}</p>
          <p className="text-gray-600 text-sm"><strong>Category:</strong> {product.category || "N/A"}</p>
          <p className="text-gray-600 text-sm"><strong>Location:</strong> {product.location?.city}, {product.location?.state}, {product.location?.country}</p>
        </div>

        <p className="mt-4 text-gray-700 text-sm">{product.description || "No description available."}</p>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Buy Now</button>
          <button className="w-full px-5 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">Make an Offer</button>
          <button className="w-full px-5 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition">Chat with Seller</button>
        </div>
      </div>
    </div>
    
    
    </>

  );
};

export default ProductDetails;

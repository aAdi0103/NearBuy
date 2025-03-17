import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";
import Navbar from "../Layouts/Navbar";
import { Camera, Tag, MapPin } from 'lucide-react';

const Product = () => {
  // Fetch Auth User
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

  // Fetch All Products
  const {
    data: Products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/getAllProducts");
      return res.data;
    },
  });

  // State to Track Selected Category
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Function to Handle Category Selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };


  const filteredProducts =
    selectedCategory === "all"
      ? Products
      : Products?.filter(
          (product) =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  if (isLoading)
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-lg text-red-500">
        Failed to load products
      </div>
    );

  return (
    <>
      <div className="w-screen min-w-full mx-auto p-6 flex gap-6">

        {/* Sidebar - Filters */}
        <div className="w-1/4 h-[85vh] bg-zinc-200 p-4 shadow-md rounded-lg hidden md:block">
        <h2 className="text-lg font-bold mb-3">Filters</h2>

          <div>
            <label className="block text-[1.5vw] font-semibold mb-2">Location</label>
            <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option className="px-2">All</option>
              <option>All of {authUser?.location.city}</option>
            </select>
          </div>


          {/* Category */}
          <div className="mt-4">
  <label className="block text-[1.5vw] font-semibold text-gray-800">Category</label>
  <div className="space-y-3 mt-3">
    {[
      { value: "all", label: "All Categories" },
      { value: "Real Estate", label: "Real Estate" },
      { value: "Electronics", label: "Electronics" },
      { value: "Sports", label: "Sports" },
      { value: "Books", label: "Books" },
      { value: "Others", label: "Others" },
    ].map((category) => (
      <label
        key={category.value}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-100 transition duration-200 ease-in-out cursor-pointer"
      >
        <input
          type="checkbox"
          value={category.value}
          checked={selectedCategory.includes(category.value)}
          onChange={(e) => handleCategoryChange(category.value)}
          className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-md text-gray-700">{category.label}</span>
      </label>
    ))}
  </div>
</div>
        </div>

        {/* Main Content */}
<div className="flex-1 w-full">
  {/* Services Grid */}
  {filteredProducts?.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {filteredProducts.map((product) => (
        <a
          key={product._id}
          href={`/product/${product._id}`}
          className="bg-white shadow-md rounded-2xl overflow-hidden block hover:shadow-lg transition duration-300 w-full"
        >
          <img
            src={product.images}
            alt={product.title}
            className="w-full h-56 object-cover"
          />
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-800">
              {product.heading}
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <MapPin className="mr-1 w-4 text-blue-600" />
              {product.location.city}, {product.location.state}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <Tag className="mr-1 w-4 text-blue-600" />
              {product.category}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <Camera className="mr-1 w-4 text-blue-600" />
              Condition: {product.condition}
            </p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-bold text-blue-600">
              ₹{product.price}/-
              </span>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </a>
      ))}
    </div>
  ) : (
    <div className="text-center text-gray-500 text-lg font-medium mt-10">
      No products found for your query.
    </div>
  )}
</div>
      </div>
    </>
  );
};

export default Product;

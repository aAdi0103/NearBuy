import React, { useState } from "react";
import Navbar from "../../Layouts/Navbar";

function ServiceListing() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [languages, setLanguages] = useState([]);

  return (
    <>
        <Navbar/>

    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg w-full max-w-4xl">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Create a New Service Listing
        </h1>
        <p className="text-gray-500 mb-6">Fill out the details below to list your service and start getting bookings.</p>

        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold text-gray-700">Service Title</label>
            <input 
              type="text" 
              placeholder="e.g., Personal Yoga Training at Home" 
              className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Category</label>
            <select
              className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Fitness">Fitness & Wellness</option>
              <option value="Business">Business Consulting</option>
              <option value="Education">Online Tutoring</option>
              <option value="IT">IT & Software Services</option>
              <option value="Photography">Laundray</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>

        {/* Description & Images */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold text-gray-700">Service Description</label>
            <textarea 
              placeholder="Describe your service, expertise, and what's included..." 
              className="w-full p-3 mt-2 border rounded-lg h-28 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Service Images</label>
            <div className="mt-2 border-dashed border-2 p-6 rounded-lg flex flex-col items-center justify-center text-gray-500">
              <p>Drag and drop your images here</p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
                Browse Files
              </button>
            </div>
          </div>
        </div>

        {/* Pricing & Availability */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Pricing & Availability</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold text-gray-700">Price per Session</label>
              <input 
                type="number" 
                placeholder="$ 0.00" 
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Duration</label>
              <select
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="">Select duration</option>
                <option value="30min">30 Minutes</option>
                <option value="1hour">1 Hour</option>
                <option value="2hour">2 Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Section (Updated) */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Location</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold text-gray-700">City</label>
              <input 
                type="text" 
                placeholder="Enter city" 
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">State</label>
              <input 
                type="text" 
                placeholder="Enter state" 
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Country</label>
              <input 
                type="text" 
                placeholder="Enter country" 
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold text-gray-700">Experience Level</label>
            <select
              className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-700">Languages Spoken</label>
            <input 
              type="text" 
              placeholder="e.g., English, Spanish, Hindi" 
              className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={languages}
              onChange={(e) => setLanguages(e.target.value.split(","))}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <div>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-blue-700">
              Publish Service
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ServiceListing;

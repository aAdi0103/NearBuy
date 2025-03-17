import React, { useState } from "react";
import Navbar from "../../Layouts/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { toast, Toaster } from "react-hot-toast";
import {
  X,
  Upload,
  Camera,
  DollarSign,
  Tag,
  Package,
  Truck,
  MapPin,
} from "lucide-react";

function ServiceListing() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [description,setDescription]=useState("");
  const [language, setlanguage] = useState([]);
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (serviceData) => {
      const res = await axiosInstance.post("/services/create", serviceData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Service created successfully");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to create post");
    },
  });

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const handleServiceCreation = async () => {
    try {
      const serviceData = {
        title,
        price,
        duration,
        location,
        language,
        experience:experienceLevel,
        description,
        category:selectedCategory,
      };
  
      if (images) serviceData.images = await readFileAsDataURL(images);  
      createPostMutation(serviceData);
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };
  

  const handleImageUpload = (e) => {
		const file = e.target.files[0];
		setImages(file);
		if (file) {
			readFileAsDataURL(file).then(setImagePreview);
		} else {
			setImagePreview(null);
		}
	};
  
  const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

  return (
    <>
    <Toaster/>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg w-full max-w-4xl">
          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Create a New Service Listing
          </h1>
          <p className="text-gray-500 mb-6">
            Fill out the details below to list your service and start getting
            bookings.
          </p>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-semibold text-gray-700">
                Service Title
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Personal Yoga Training at Home"
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">
                Category
              </label>
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
              <label className="block font-semibold text-gray-700">
                Service Description
              </label>
              <textarea
              value={description}
              onChangeCapture={(e)=> setDescription(e.target.value)}
                placeholder="Describe your service, expertise, and what's included..."
                className="w-full p-3 mt-2 border rounded-lg h-28 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Camera className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Media</h2>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-200">
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-blue-600 mb-3" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF</span>
                </label>
              </div>
              {imagePreview && (
				<div className='mt-2'>
					<img src={imagePreview} alt='Selected' className='w-full h-auto rounded-lg' />
				</div>
			)}
            </div>

          </div>

          {/* Pricing & Availability */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Pricing & Availability
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block font-semibold text-gray-700">
                  Price per Session
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">
                  Duration
                </label>
                <select
                  className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="">Select duration</option>
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="2 Hours">2 Hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Section (Updated) */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={location.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={location.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={location.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-semibold text-gray-700">
                Experience Level
              </label>
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
              <label className="block font-semibold text-gray-700">
                language Spoken
              </label>
              <input
                type="text"
                placeholder="e.g., English, Spanish, Hindi"
                className="w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={language}
                onChange={(e) => setlanguage(e.target.value.split(","))}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Cancel
            </button>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="px-6 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200"
                onClick={handleServiceCreation}
              >
                Publish Listing
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ServiceListing;

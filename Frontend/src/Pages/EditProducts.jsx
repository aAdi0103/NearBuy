import { useState,useEffect } from "react";
import { X, Upload, Camera, DollarSign, Tag, Package, Truck,MapPin } from "lucide-react";
import Navbar from "../Layouts/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast, Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import axios from 'axios'


const EditProducts = () => {

  const { data: authUser} = useQuery({
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
  console.log(authUser)

  const { id } = useParams();
const queryClient = useQueryClient();


// Fetch product details
const { data: ProductDetails, error, isLoading } = useQuery({
  queryKey: ["ProductDetails", id],
  queryFn: async () => {
    console.log("Fetching Product Details...");
    
    try {
      const response = await axiosInstance.get(`/posts/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Fetched Data:", response.data);
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      throw err;
    }
  },
  enabled: !!id, // Fetch only when ID is available
  onError: (err) => console.error("Error fetching product details:", err),
});

// State variables (initialized as empty strings)
const [title, setTitle] = useState("");
const [category, setCategory] = useState("");
const [description, setDescription] = useState("");
const [price, setPrice] = useState("");
const [quantity, setQuantity] = useState("");
const [condition, setCondition] = useState("");
const [images, setImages] = useState([]);
const [imagePreview, setImagePreview] = useState([]);
const [location, setLocation] = useState({
  city: "",
  state: "",
  country: "",
});

// Update state after ProductDetails is available
useEffect(() => {
  if (ProductDetails) {
    setTitle(ProductDetails.heading || "");
    setCategory(ProductDetails.category || "");
    setDescription(ProductDetails.description || "");
    setPrice(ProductDetails.price || "");
    setQuantity(ProductDetails.quantity || "");
    setCondition(ProductDetails.condition || "");
    setLocation({
      city: ProductDetails.location?.city || "",
      state: ProductDetails.location?.state || "",
      country: ProductDetails.location?.country || "",
    });
  }
}, [ProductDetails]);


	const { mutate: updatePostMutation, isPending } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.put(`posts/updatePost/${id}`, postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			// resetForm();
			toast.success("Post Updated successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to create post");
		},
	});


  const handlePostUpdation = async () => {
    try {
      const postData = { heading: title, category, description, price, quantity, condition, location };
  
      // Check if images exist, otherwise keep previous images
      if (images.length > 0) {
        postData.images = await readFileAsDataURL(images);
      } else {
        postData.images = imagePreview; // Keep existing images if no new images are selected
      }
     console.log(postData)
      updatePostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostUpdation:", error);
    }
  };
  

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
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
        <Toaster />
        <Navbar/>

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
            <h1 className="text-3xl font-bold text-white">Edit Your Product</h1>
          </div>

          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter a compelling title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Books">Books & Stationery</option>
                    <option value="Sports">Sports & Outdoors</option>
                    <option value="Real Estate">Real Estate & Rentals</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                    
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe your item in detail"
                />
              </div>

            </div>

            {/* location */} 

            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
      <div className="flex items-center">
        <MapPin className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Location</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
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


            {/* Pricing & Details */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Pricing & Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <div className="flex flex-wrap gap-3">
                  {["New", "Like New", "Used", "Refurbished"].map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setCondition(cond)}
                      className={`px-5 py-2.5 rounded-xl transition-all duration-200 ${
                        condition === cond
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Media */}

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




            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-6 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200"
                onClick={handlePostUpdation}
                >
                  Publish Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default EditProducts;
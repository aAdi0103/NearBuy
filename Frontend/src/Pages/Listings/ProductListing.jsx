import { useState } from 'react'
import { X, Upload, Camera, DollarSign, Tag, Package, Truck, MapPin } from 'lucide-react'
import Navbar from '../../Layouts/Navbar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../lib/axios'
import { toast, Toaster } from 'react-hot-toast'
import {useNavigate } from 'react-router-dom'
import {
	FaArrowLeft,
  } from 'react-icons/fa'
const ProductListing = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [condition, setCondition] = useState('New')
  const [images, setImages] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()

  const [location, setLocation] = useState({
    area: '',
    city: '',
    state: '',
    country: '',
  })

  // getting the loggedIn user
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me')
        return res.data
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null
        }
        toast.error(err.response.data.message || 'Something went wrong')
      }
    },
  })

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value })
  }

  const queryClient = useQueryClient()

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      try {
        const res = await axiosInstance.post('/posts/create', postData, {
          headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
      } catch (error) {
        // Extract error message from backend response
        const errorMessage = error.response?.data?.message || "Failed to create post";
  
        // Handle specific errors
        if (errorMessage.includes("Image rejected")) {
          toast.error(errorMessage); // Show specific image rejection reason
        } else if (errorMessage.includes("Coordinates not found")) {
          toast.error("Coordinates not found for the given address. Please try again.");
        } else if (errorMessage.includes("Invalid location")) {
          toast.error("Invalid location. Please enter a correct location with proper spelling.");
        } else if (errorMessage.includes('Your post contains restricted words')) {
          toast.error('Your post contains restricted words. Please remove them and try again.');
        } else {
          toast.error("Post creation failed. Please try again.");
        }
  
        throw errorMessage;
      }
    },
    onSuccess: () => {
      toast.success('Post created successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err) => {
      toast.error(err || 'Something went wrong. Please check your location spelling.');
    },
  });
  


  

  const handlePostCreation = async () => {
    try {
      const postData = {
        heading: title,
        category,
        description,
        price,
        quantity,
        condition,
        location,
      }
      if (images) postData.images = await readFileAsDataURL(images)

      createPostMutation(postData)
    } catch (error) {
      console.error('Error in handlePostCreation:', error)
    }
  }

  const resetForm = () => {
    setImages(null)
    setImagePreview(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    setImages(file)
    if (file) {
      readFileAsDataURL(file).then(setImagePreview)
    } else {
      setImagePreview(null)
    }
  }

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <>
    <button
                          onClick={() => navigate(-1)}
                          className="text-black-700 absolute left-5 top-20 flex items-center transition-all hover:text-blue-900"
                        >
                          <FaArrowLeft className="text-md mr-2" /> <span className="font-medium">Back</span>
                        </button>
      <Toaster />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border mt-5 border-gray-100 bg-white shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
              <h1 className="text-3xl font-bold text-white">List Your Product</h1>
              <p className="mt-2 text-black">Please Enter Correct Details to meet Buyer</p>
            </div>

            <div className="space-y-8 p-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Listing Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a compelling title"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your item in detail"
                  />
                </div>
              </div>

              {/* location */}

              <div className="space-y-6 rounded-xl bg-gray-50 p-6">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Location</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Area</label>
                    <input
                      type="text"
                      name="area"
                      value={location.area}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter area"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={location.city}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={location.state}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={location.country}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Details */}
              <div className="space-y-6 rounded-xl bg-gray-50 p-6">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Pricing & Details</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(parseInt(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      min="1"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Condition</label>
                  <div className="flex flex-wrap gap-3">
                    {['New', 'Like New', 'Used', 'Refurbished'].map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setCondition(cond)}
                        className={`rounded-xl px-5 py-2.5 transition-all duration-200 ${
                          condition === cond
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'border border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-50'
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
                  <Camera className="mr-2 h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Media</h2>
                </div>

                <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center transition-colors duration-200 hover:border-blue-500">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex cursor-pointer flex-col items-center"
                  >
                    <Upload className="mb-3 h-12 w-12 text-blue-600" />
                    <span className="text-sm text-gray-600">Click to upload images</span>
                    <span className="mt-1 text-xs text-gray-500">
                      Supported formats: JPG, PNG, GIF
                    </span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Selected" className="h-auto w-full rounded-lg" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
                <button className="text-gray-600 transition-colors hover:text-gray-900">
                  Cancel
                </button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="rounded-xl bg-blue-600 px-6 py-2.5 text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow"
                    onClick={handlePostCreation}
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
  )
}

export default ProductListing

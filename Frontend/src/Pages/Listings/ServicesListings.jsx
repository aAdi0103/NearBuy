import React, { useState } from 'react'
import Navbar from '../../Layouts/Navbar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../lib/axios'
import { toast, Toaster } from 'react-hot-toast'
import { X, Upload, Camera, DollarSign, Tag, Package, Truck, MapPin } from 'lucide-react'
import {useNavigate } from 'react-router-dom'
import {
	FaArrowLeft,
  } from 'react-icons/fa'
function ServiceListing() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(0)
  const [duration, setDuration] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [description, setDescription] = useState('')
  const [language, setlanguage] = useState([])
  const [location, setLocation] = useState({
    area: '',
    city: '',
    state: '',
    country: '',
  })
  const navigate = useNavigate()

  const [images, setImages] = useState([])
  const [imagePreview, setImagePreview] = useState(null)

  const queryClient = useQueryClient()

  const { mutate: createServiceMutation, isPending } = useMutation({
    mutationFn: async (serviceData) => {
      try {
        const res = await axiosInstance.post('/services/create', serviceData, {
          headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
      } catch (error) {
        throw error.response?.data?.message || "Failed to create service";
      }
    },
    onSuccess: () => {
      toast.success('Service created successfully');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (err) => {
      toast.error(err || 'Something went wrong. Please check your location spelling.');
    },
  });
  

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value })
  }

  const handleServiceCreation = async () => {
    try {
      const serviceData = {
        title,
        price,
        duration,
        location,
        language,
        experience: experienceLevel,
        description,
        category: selectedCategory,
      }

      if (images) serviceData.images = await readFileAsDataURL(images)
      createServiceMutation(serviceData)
    } catch (error) {
      console.error('Error creating service:', error)
    }
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
      <Toaster />
      <Navbar />
       <button
                      onClick={() => navigate(-1)}
                      className="text-black-700 absolute left-5 top-20 flex items-center transition-all hover:text-blue-900"
                    >
                      <FaArrowLeft className="text-md mr-2" /> <span className="font-medium">Back</span>
                    </button>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-4xl mt-7 rounded-2xl bg-white p-6 shadow-lg md:p-10">
          {/* Heading */}
          <h1 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
            Create a New Service Listing
          </h1>
          <p className="mb-6 text-gray-500">
            Fill out the details below to list your service and start getting bookings.
          </p>

          {/* Basic Information */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block font-semibold text-gray-700">Service Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Personal Yoga Training at Home"
                className="mt-2 w-full rounded-lg border p-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Category</label>
              <select
                className="mt-2 w-full rounded-lg border p-3 focus:border-blue-500 focus:ring-blue-500"
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
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block font-semibold text-gray-700">Service Description</label>
              <textarea
                value={description}
                onChangeCapture={(e) => setDescription(e.target.value)}
                placeholder="Describe your service, expertise, and what's included..."
                className="mt-2 h-28 w-full rounded-lg border p-3 focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>

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
          </div>

          {/* Pricing & Availability */}
          <div className="mb-6 rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Pricing & Availability</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="block font-semibold text-gray-700">Price per Session</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="mt-2 w-full rounded-lg border p-3 focus:border-blue-500 focus:ring-blue-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Duration</label>
                <select
                  className="mt-2 w-full rounded-lg border p-3 focus:border-blue-500 focus:ring-blue-500"
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
                  placeholder="Enter city"
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

          {/* Additional Details */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block font-semibold text-gray-700">Experience Level</label>
              <select
                className="mt-2 w-full rounded-lg border p-3 focus:border-blue-500 focus:ring-blue-500"
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
              <label className="block font-semibold text-gray-700">language Spoken</label>
              <input
                type="text"
                placeholder="e.g., English, Spanish, Hindi"
                className="mt-2 w-full rounded-lg border p-3 focus:border-blue-500 focus:ring-blue-500"
                value={language}
                onChange={(e) => setlanguage(e.target.value.split(','))}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
            <button className="text-gray-600 transition-colors hover:text-gray-900">Cancel</button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow"
                onClick={handleServiceCreation}
              >
                Publish Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ServiceListing

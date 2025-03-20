import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../lib/axios'
import { useParams } from 'react-router-dom'
import { FaMapMarkerAlt, FaCheckCircle, FaStar } from 'react-icons/fa'
import axios from 'axios'
const ProductDetails = () => {
  const { id } = useParams()

  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/${id}`)
      return response.data
    },
    enabled: !!id,
    onError: (err) => console.error('Error fetching product details:', err),
  })

  const sellerId = product?.author

  const {
    data: seller,
    isLoading: isSellerLoading,
    error: sellerError,
  } = useQuery({
    queryKey: ['seller', sellerId],
    queryFn: async () => {
      if (!sellerId) return null
      const response = await axiosInstance.get(`/users/${sellerId}`)
      return response.data
    },
    enabled: !!sellerId,
  })

  if (isLoading) return <p className="text-center text-gray-600">Loading product details...</p>
  if (error) return <p className="text-center text-red-500">Error loading product</p>

  return (
    <>
      <div className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow-md">
        <h1 className="ml-10 font-bold underline">Posted By :</h1>

        {isSellerLoading ? (
          <p>Loading seller details...</p>
        ) : sellerError ? (
          <p className="text-red-500">Error loading seller details</p>
        ) : seller ? (
          <a className="flex gap-4" href={`/profile/${seller.email}`}>
            <img
              src={seller.profilePic || '/default-profile.png'}
              alt={seller.name || 'Seller'}
              className="h-12 w-12 rounded-full object-cover"
            />

            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <h2 className="text-lg font-semibold">{seller.name || 'Unknown'}</h2>
              </div>
              <p className="flex items-center text-sm text-gray-600">
                <FaMapMarkerAlt className="mr-1 text-gray-500" />
                {seller.location?.city || 'Location not available'}
              </p>
            </div>
          </a>
        ) : (
          <p>No seller details available</p>
        )}
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 overflow-hidden rounded-lg border bg-white p-6 shadow-lg md:grid-cols-3">
        {/* Product Image */}
        <div className="md:col-span-2">
          <div className="relative">
            <img
              className="h-80 w-full rounded-lg object-cover"
              src={product.images || '/placeholder.jpg'} // Use product.images directly
              alt={product.title || 'Product Image'}
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{product.heading || 'Product Title'}</h2>
          <div className="mt-4">
            <p className="text-2xl font-bold text-blue-600">₹{product.price || 'N/A'}</p>
            <p className="text-sm text-gray-600">
              <strong>Condition:</strong> {product.condition || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Category:</strong> {product.category || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {product.location?.city}, {product.location?.state},{' '}
              {product.location?.country}
            </p>
          </div>

          <p className="mt-4 text-sm text-gray-700">
            {product.description || 'No description available.'}
          </p>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {seller ? (
              <a href={`/profile/${seller.email}`}>
                <button className="w-full rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
                  Contact Seller to Buy Product
                </button>
              </a>
            ) : (
              <p className="text-center text-gray-500">Seller details unavailable</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetails

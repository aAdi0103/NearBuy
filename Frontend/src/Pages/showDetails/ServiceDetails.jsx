import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import BookingButton from '../Listings/BookingButton';

const ServiceDetails = () => {

  const { id } = useParams();

  const { data: authUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response.data.message || 'Something went wrong');
      }
    },
  });


  const {
    data: service,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/services/${id}`);
      return response.data;
    },
    enabled: !!id,
    onError: (err) => console.error('Error fetching Service details:', err),
  });


  const sellerId = service?.provider;

  const {
    data: seller,
    isLoading: isSellerLoading,
    error: sellerError,
  } = useQuery({
    queryKey: ['seller', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const response = await axiosInstance.get(`/users/${sellerId}`);
      return response.data;
    },
    enabled: !!sellerId,
  });

  if (isLoading)
    return (
      <p className="text-center text-gray-600">Loading product details...</p>
    );
  if (error)
    return <p className="text-center text-red-500">Error loading product</p>;


  return (
    <>
      <div className="flex space-x-4 items-center bg-white p-4 rounded-lg shadow-md">
        <h1 className="font-bold underline ml-10">Posted By :</h1>

        {isSellerLoading ? (
          <p>Loading seller details...</p>
        ) : sellerError ? (
          <p className="text-red-500">Error loading seller details</p>
        ) : seller ? (
          <a className="flex gap-4" href={`/profile/${seller.email}`}>
            <img
              src={seller.profilePic || '/default-profile.png'}
              alt={seller.name || 'Seller'}
              className="w-12 h-12 rounded-full object-cover"
            />
            
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <h2 className="text-lg font-semibold">
                  {seller.name || 'Unknown'}
                </h2>
              </div>
              <p className="text-gray-600 flex items-center text-sm">
                <FaMapMarkerAlt className="mr-1 text-gray-500" />
                {seller.location?.city || 'Location not available'}
              </p>
            </div>
          </a>
        ) : (
          <p>No seller details available</p>
        )}
      </div>

      <div className="max-w-6xl mt-4 mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Product Image */}
      <div className="md:col-span-2 relative">
        <img
          className="w-full h-96 object-cover rounded-2xl shadow-lg"
          src={service.images || '/placeholder.jpg'}
          alt={service.title || 'Product Image'}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">{service.title || 'Product Title'}</h2>
          <div className="mt-4 space-y-2">
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              ₹{service.price}/ <span className="text-gray-700 text-lg">{service.duration}</span>
            </p>
            <p className="text-gray-700 text-md font-medium">
              <strong>Experience:</strong> {service.experience || 'N/A'}
            </p>
            <p className="text-gray-700 text-md font-medium">
              <strong>Category:</strong> {service.category || 'N/A'}
            </p>
            <p className="text-gray-700 text-md font-medium flex items-center">
              <FaMapMarkerAlt className="mr-2 text-red-500" />
              {service.location?.city}, {service.location?.state}, {service.location?.country}
            </p>
          </div>

          <p className="mt-4 text-gray-600 text-md leading-relaxed">
            {service.description || 'No description available.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-4">
          {seller ? (
            <a href={`/profile/${seller.email}`}>
              <button className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md hover:opacity-90 transition-all">
                Contact Provider
              </button>
            </a>
          ) : (
            <p className="text-center text-gray-500">Seller details unavailable</p>
          )}

          <BookingButton authUser={authUser} seller={seller} />
        </div>
      </div>
    </div>
    </>
  );
};

export default ServiceDetails;

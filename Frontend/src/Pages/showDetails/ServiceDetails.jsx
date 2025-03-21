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
  const handleBooking = (event) => {
    event.preventDefault(); // Prevents the default link action

    const isConfirmed = window.confirm("Are you sure you want to book this service?");
    if (isConfirmed) {
      window.location.href = `/Booking/${authUser._id}`; // Redirects after confirmation
    }
  };

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

      <div className="max-w-6xl mt-16 mx-auto bg-white shadow-lg rounded-lg overflow-hidden border p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Image */}
        <div className="md:col-span-2">
          <div className="relative">
            <img
              className="w-full h-80 object-cover rounded-lg"
              src={service.images || '/placeholder.jpg'}
              alt={service.title || 'Product Image'}
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {service.title || 'Product Title'}
          </h2>
          <div className="mt-4">
            <p className="text-2xl font-bold text-blue-600">
              ₹{service.price}/{' '}
              <span className="text-black text-sm">{service.duration}</span>
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Experience:</strong> {service.experience || 'N/A'}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Category:</strong> {service.category || 'N/A'}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Location:</strong> {service.location?.city},{' '}
              {service.location?.state}, {service.location?.country}
            </p>
          </div>

          <p className="mt-4 text-gray-700 text-sm">
            {service.description || 'No description available.'}
          </p>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {seller ? (
              <a href={`/profile/${seller.email}`}>
                <button className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  Contact Provider
                </button>
              </a>
            ) : (
              <p className="text-center text-gray-500">
                Seller details unavailable
              </p>
            )}

  <BookingButton authUser={authUser} seller={seller}></BookingButton>

          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;

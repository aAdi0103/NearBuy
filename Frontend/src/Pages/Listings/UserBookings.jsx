import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {axiosInstance} from "../../lib/axios"; // Ensure correct API setup
import { toast } from "react-hot-toast";
import {useNavigate } from 'react-router-dom'
import {
	FaArrowLeft,
  } from 'react-icons/fa'
const UserBookings = () => {
    const navigate = useNavigate()

  const { id } = useParams(); // Get user ID from URL
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get(`/notifications/user/${id}`);
  
        if (res.data.length === 0) {
          setError("No bookings found.");
        } else {
          setBookings(res.data);
          setError(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
        toast.error("Error fetching bookings!");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, [id]);
  console.log(bookings)
  

  if (loading) return <p className="text-center text-lg font-semibold">Loading bookings...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">{error}</p>;

  return (
    <>
     <button
                      onClick={() => navigate(-1)}
                      className="text-black-700 absolute left-12 top-10 flex items-center transition-all hover:text-blue-900"
                    >
                      <FaArrowLeft className="text-md mr-2" /> <span className="font-medium">Back</span>
                    </button>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Your Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-lg bg-white p-4 shadow-lg transition-transform duration-300"
            >
              {/* Image */}
              <img
                src={booking.relatedPost?.images || "https://via.placeholder.com/300"}
                alt={booking.relatedPost?.title}
                className="h-48 w-full rounded-md object-cover"
              />

              {/* Booking Details */}
              <div className="mt-3">
                <h3 className="text-xl font-bold text-gray-800">{booking.relatedPost?.title}</h3>

                <p className="text-sm text-gray-600 mt-1">
                  📍 {booking.relatedPost?.location?.area}, {booking.relatedPost?.location?.city}
                </p>

                <p className="text-blue-600 font-semibold mt-1">
                  💰 ₹ {booking.relatedPost?.price} / {booking.relatedPost?.duration}
                </p>

                <p className="text-gray-500 mt-2">📅 Date: {new Date(booking.date).toLocaleDateString()}</p>

                <p className="text-gray-500 mt-1">⏳ Status: <span className="font-semibold">{booking.status}</span></p>

                {/* View Booking Button */}
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                  <a href={`/service/${booking.relatedPost._id}`} className="block text-center">
                    View Details
                  </a>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default UserBookings;

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const BookingButton = ({ seller, authUser }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showOverlay, setShowOverlay] = useState(false);
  const [message, setMessage] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null); // Track booking status

  // Fetch existing booking status
  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        const response = await axiosInstance.get(`/notifications/status/${authUser._id}/${id}`);
        setBookingStatus(response.data.status); 
      } catch (error) {
        console.error("Error fetching booking status:", error);
      }
    };

    fetchBookingStatus();
  }, [authUser._id, id]);

  const handleConfirmBooking = async () => {
    try {
      const response = await axiosInstance.post("/notifications/createNotification", {
        receiver: authUser._id,
        sender: seller._id,
        relatedPost: id,
        message,
      });

      if (response.status === 201) {
        toast.success("Booking request sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setBookingStatus("sent"); // Update status locally
        setShowOverlay(false);
        navigate(`/Booking/${authUser._id}/${id}`);
      }
    } catch (error) {
      console.error("Booking request failed:", error);
      toast.error("Failed to send booking request.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="text-center">
      {seller ? (
        <>
          {/* Show appropriate button based on booking status */}
          {bookingStatus === "sent" || bookingStatus === "accepted" || bookingStatus === "rejected" ? (
            <button
              onClick={() => navigate(`/Booking/${authUser._id}/${id}`)}
              className={`w-full px-5 py-3 mt-5 font-semibold rounded-lg transition ${
                bookingStatus === "sent"
                  ? "bg-gray-300 text-black hover:bg-gray-600"
                  : bookingStatus === "accepted"
                  ? "bg-green-500 text-white hover:bg-green-700"
                  : "bg-red-500 text-white hover:bg-red-700"
              }`}
            >
              {bookingStatus === "sent"
                ? "Request Sent"
                : bookingStatus === "accepted"
                ? "Booked"
                : "Booking Rejected"}
            </button>
          ) : (
            <>
              {/* Book Service Button */}
              <button
                onClick={() => setShowOverlay(true)}
                className="w-full px-5 py-3 mt-5 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition"
              >
                Book Service
              </button>

              {/* Negotiation Overlay */}
              {showOverlay && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[50vw]">
                    <h2 className="text-lg font-semibold mb-2">Confirm Booking</h2>
                    <textarea
                      className="w-full p-2 border rounded-lg"
                      rows="4"
                      placeholder="Enter a message for the provider like Price negotiation, your availability, and more..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-between">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        onClick={() => setShowOverlay(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        onClick={handleConfirmBooking}
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">Seller details unavailable</p>
      )}
    </div>
  );
};

export default BookingButton;

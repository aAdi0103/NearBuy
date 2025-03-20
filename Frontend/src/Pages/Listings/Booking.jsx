import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { axiosInstance } from "../../lib/axios"; // Import axios instance
import { useQuery } from "@tanstack/react-query";

const Booking = () => {
  const { ids } = useParams();
  const navigate = useNavigate();
  const [bookingStatus, setBookingStatus] = useState("pending"); // Default status
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Fetch booking status from backend
  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        const response = await axiosInstance.get(`/notifications/status/${authUser._id}/${ids}`);
        setBookingStatus(response.data.status); // Update status
      } catch (error) {
        console.error("Error fetching booking status:", error);
      }
    };

    fetchBookingStatus();
  }, [ids, authUser]);

  // Status steps
  const steps = ["Sent", "Pending", "Accepted", "Rejected"];
  const stepIndex = steps.indexOf(
    bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)
  );

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-black-700 absolute left-5 top-6 flex items-center transition-all hover:text-blue-900"
      >
        <FaArrowLeft className="text-md mr-2" />
        <span className="font-mono text-xl font-medium">Back</span>
      </button>

      {/* Booking Status Timeline */}
      <div className="mt-16 max-w-md mx-auto">
        <h2 className="text-center text-2xl font-semibold mb-4">Booking Status</h2>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-5 top-0 bottom-0 w-1 bg-gray-300"></div>

          {/* Timeline Steps */}
          {steps.map((step, index) => {
            // Determine color based on status
            const isCompleted = index <= stepIndex;
            const isRejected = bookingStatus === "rejected" && step === "Rejected";
            const stepColor = isRejected
              ? "bg-red-500 border-red-500 text-white"
              : isCompleted
              ? "bg-green-500 border-green-500 text-white"
              : "bg-gray-200 border-gray-300 text-gray-500";
            const textColor = isRejected
              ? "text-red-600 font-bold"
              : isCompleted
              ? "text-green-600 font-bold"
              : "text-gray-500";

            return (
              <div key={index} className="relative flex items-center mb-6">
                {/* Status Circle */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${stepColor}`}>
                  {isCompleted ? "✓" : ""}
                </div>

                {/* Step Label */}
                <p className={`ml-4 text-lg ${textColor}`}>{step}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Booking;

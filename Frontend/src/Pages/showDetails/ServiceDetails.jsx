import React from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from '../../lib/axios';
function ServiceDetails() {
    const {id} = useParams();
    console.log(id);

    const queryClient = useQueryClient();

    // Fetch product details
    const {
      data: ServiceDetails,
      error,
      isLoading,
    } = useQuery({
      queryKey: ["ServiceDetails", id],
      queryFn: async () => {
        console.log("Fetching Service Details...");
  
        try {
          const response = await axiosInstance.get(`/services/${id}`, {
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
      onError: (err) => console.error("Error fetching Services details:", err),
    });
    console.log(ServiceDetails)

  return (
    <div>
      Service details
    </div>
  )
}

export default ServiceDetails

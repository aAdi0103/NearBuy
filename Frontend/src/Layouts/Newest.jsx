import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { Home,Utensils,ArrowRight, Dumbbell, GraduationCap, Laptop2, BookOpen, ShoppingCart, ListChecks } from "lucide-react";

const Newest = () => {

    const { data: authUser, isLoading } = useQuery({
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

  return (
     <div className="max-w-7xl mt-20 mx-auto sm:px-6 lg:px-8">

          <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-6">
      {authUser && authUser.location && authUser.location.city 
        ? `Newest Services in ${authUser.location.city}`
        : "Popular"}
    </h2>
    
          <a className="text-blue-700 font-semibold flex items-center" href="">
              View All <ArrowRight className="ml-1" size={18} />
            </a>      
            </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
              <img
                src="https://media.istockphoto.com/id/1417833187/photo/professional-cleaner-vacuuming-a-carpet.jpg?s=1024x1024&w=is&k=20&c=Q7Gp-iPTWB-FhyTXpaoqITz4HDgcPaMHB8MdCFFxmSY="
                alt="Professional House Cleaning"
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2">Professional House Cleaning</h3>
              <p className="text-blue-600">$25/hr</p>
              <p className="text-gray-500 text-sm">CleanPro Services</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Book Now
              </button>
            </div>
            {/* Card 2 */}
            <div className="bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
              <img
                src="https://plus.unsplash.com/premium_photo-1664109999537-088e7d964da2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZpdG5lc3N8ZW58MHx8MHx8fDA%3D"
                alt="Personal Fitness Training"
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2">Personal Fitness Training</h3>
              <p className="text-blue-600">$40/session</p>
              <p className="text-gray-500 text-sm">FitLife Coaches</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Book Now
              </button>
            </div>
            {/* Card 3 */}
            <div className="bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
              <img
                src="https://plus.unsplash.com/premium_photo-1661634777510-e6e56b312604?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFpZHxlbnwwfHwwfHx8MA%3D%3D"
                alt="Handmade Pottery Classes"
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2">Maid</h3>
              <p className="text-blue-600">$35/class</p>
              <p className="text-gray-500 text-sm">Creative Arts Studio</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Book Now
              </button>
            </div>
            {/* Card 4 */}
            <div className="bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dHV0b3J8ZW58MHx8MHx8fDA%3D"
                alt="Math Tutoring"
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2">Tutoring</h3>
              <p className="text-blue-600">$30/hr</p>
              <p className="text-gray-500 text-sm">Academic Excellence</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Book Now
              </button>
            </div>
          </div>


        </div>

  )
}

export default Newest;

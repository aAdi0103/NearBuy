import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { axiosInstance } from "../lib/axios";
import { Menu, X, MapPin, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const queryClient = useQueryClient(); // Get queryClient instance

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
      }
    },
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userLocation = authUser
    ? { city: authUser.location.city, state: authUser.location.state, country: authUser.location.country }
    : { city: <a href="/profile" className="text-blue-500">Set Your Location</a> };

  // Logout function
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.setQueryData(["authUser"], null); // Force update immediately
    },
  });


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  return (
    <nav className="bg-white shadow-sm relative">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-blue-600 text-xl font-bold">LocalHub</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-gray-600 mr-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-blue-600">
                <a href="/profile">{userLocation.city} {userLocation.state || ""}{" "}
                {userLocation.country || ""}</a>
              </span>
            </div>
            <button className="bg-yellow-600 font-mono text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <a href="/list">List Services/Items</a>
            </button>

            {/* User Dropdown */}
            {authUser ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-zinc-400 p-2 rounded-full text-gray-700 cursor-pointer hover:text-gray-900"
                >
                  <User className="w-8 h-8" />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300">
                  <Link
                    to="/profile"
                    className="flex font-semibold items-center px-4 py-3 text-gray-800 hover:bg-gray-100 transition duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 017.757 16h8.486a4 4 0 012.636 1.804M12 14a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    Profile
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="flex items-center w-full text-left px-4 py-3 text-gray-800 hover:bg-red-100 font-semibold hover:text-red-600 transition duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    </svg>
                    Logout
                  </button>
                </div>
                
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="text-black font-mono bg-blue-500 px-4 py-2 rounded-md hover:text-gray-900">
                  Sign In / Sign Up
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {userLocation.city}, {userLocation.state || ""}{" "}
                {userLocation.country || ""}
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/login">
                <button className="text-gray-600 hover:text-gray-900">
                  Sign In
                </button>
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                List Service/Item
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

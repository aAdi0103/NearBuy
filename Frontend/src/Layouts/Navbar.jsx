import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' // Import useQueryClient
import { axiosInstance } from '../lib/axios'
import { Menu, X, MapPin, User, ChevronDown,Bell, } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/2.png'

const Navbar = () => {
  const queryClient = useQueryClient() // Get queryClient instance

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me')
        return res.data
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null
        }
      }
    },
  })

  const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const userLocation = authUser
    ? {
        area: authUser.location.area,
        city: authUser.location.city,
        state: authUser.location.state,
        country: authUser.location.country,
      }
    : {
        city: (
          <a href="/login" className="text-blue-500">
            Set Your Location
          </a>
        ),
      }

  // Logout function
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/auth/logout')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
      queryClient.setQueryData(['authUser'], null) // Force update immediately
    },
  })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])
  const pendingNotificationCount = notifications?.data.notifications.filter((notif) => notif.status === "sent").length;

  return (
    <nav className="relative bg-white shadow-sm">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex h-screen items-center justify-center">
            <a href="/">
              <div className="flex flex-shrink-0 items-center justify-center">
                <img className="w-[10vw] sm:w-[7vw] md:w-[5.5vw]" src={logo} alt="" />
                <h1 className="mb-1 ml-[-10px] text-[4vw] font-bold text-blue-600 sm:ml-[-12px] sm:text-[3vw] md:ml-[-15px] md:text-[2vw]">
                  NearBuy
                </h1>
              </div>
            </a>
          </div>

          

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-4 md:flex">
            <div className="mr-3 flex items-center text-gray-600">
              <MapPin className="mr-1 h-4 w-4" />
              <span className="font-mono text-blue-600">
                <a href={authUser ? `/profile/${authUser.email}` : '/login'}>
                  {authUser
                    ? `${userLocation?.area || ''} ${userLocation?.city || ''} ${userLocation?.state || ''} ${userLocation?.country || ''}`.trim()
                    : 'Set your location'}
                </a>
              </span>
            </div>

            <button className="rounded-md bg-yellow-600 px-4 py-2 font-mono text-white hover:bg-blue-700">
              <a href="/list">List Services/Items</a>
            </button>
            <Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
									<Bell size={20} />
									<span className='text-xs hidden md:block'>Notifications</span>
									{pendingNotificationCount > 0 && (
										<span
											className='absolute -top-1 -right-6 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{pendingNotificationCount}
										</span>
									)}
								</Link>

            {/* User Dropdown */}
            {authUser ? (
              <div className="dropdown-container relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex cursor-pointer items-center space-x-2 rounded-full bg-zinc-400 p-2 text-gray-700 hover:text-gray-900"
                >
                  <User className="h-8 w-8" />
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-20 top-5 z-50 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl transition-all duration-300">
                    <Link
                      to={`/profile/${authUser.email}`}
                      className="flex items-center px-4 py-3 font-semibold text-gray-800 transition duration-200 hover:bg-gray-100"
                    >
                      <svg
                        className="mr-2 h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A4 4 0 017.757 16h8.486a4 4 0 012.636 1.804M12 14a4 4 0 100-8 4 4 0 000 8z"
                        />
                      </svg>
                      Profile
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="flex w-full items-center px-4 py-3 text-left font-semibold text-gray-800 transition duration-200 hover:bg-red-100 hover:text-red-600"
                    >
                      <svg
                        className="mr-2 h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="rounded-md bg-blue-500 px-4 py-2 font-mono text-black hover:text-gray-900">
                  Sign In / Sign Up
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-1 h-4 w-4" />
              <span>
                {userLocation.city}, {userLocation.state || ''} {userLocation.country || ''}
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
          <div className="pb-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link to="/login">
                <button className="text-gray-600 hover:text-gray-900">Sign In</button>
              </Link>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                List Service/Item
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

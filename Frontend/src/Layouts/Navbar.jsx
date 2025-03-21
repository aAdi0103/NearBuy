import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { Menu, X, MapPin, User, ChevronDown, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/2.png';

const Navbar = () => {
  const queryClient = useQueryClient();
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
      }
    },
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => axiosInstance.get('/notifications'),
    enabled: !!authUser,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userLocation = authUser
    ? `${authUser.location.area || ''} ${authUser.location.city || ''} ${authUser.location.state || ''} ${authUser.location.country || ''}`.trim()
    : 'Set your location';

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      queryClient.setQueryData(['authUser'], null);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const pendingNotificationCount = notifications?.data.notifications.filter(
    (notif) => notif.status === 'sent'
  ).length;

  return (
    <nav className="relative bg-white shadow-sm">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <div className="flex items-center">
              <img className="mx-auto w-[10vw] max-md:w-[28vw]" src="/src/assets/NearBuy.svg" alt="NearBuy" />
                
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {authUser && (
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-1 h-4 w-4" />
                <span className="font-mono text-blue-600">{userLocation}</span>
              </div>
            )}
            {authUser ? (
              <>
                <button className="bg-yellow-600 px-4 py-2 text-white hover:bg-blue-700 rounded-md">
                  <Link to="/list">List Services/Items</Link>
                </button>
                <Link to="/notifications" className="relative text-neutral">
                  <Bell size={20} />
                  {pendingNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-4 bg-blue-500 text-white text-xs rounded-full size-4 flex items-center justify-center">
                      {pendingNotificationCount}
                    </span>
                  )}
                </Link>
                {/* User Dropdown */}
                <div className="dropdown-container relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 bg-zinc-400 rounded-full text-gray-700 hover:text-gray-900"
                  >
                    <User className="h-8 w-8" />
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-20 top-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl transition-transform duration-300">
                      <Link to={`/profile/${authUser.email}`} className="block font-bold px-4 py-3 hover:bg-gray-100">
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-3 text-left font-bold text-red-600 hover:bg-red-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login">
                <button className="bg-blue-500 px-4 py-2 text-black hover:text-gray-900 rounded-md">
                  Sign In / Sign Up
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-4 transition-transform duration-300">
            {authUser ? (
              <>
                <div className="text-gray-600 flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{userLocation}</span>
                </div>
                <Link to="/list" className="block text-center py-2 bg-yellow-600 text-white rounded-md">
                  List Services/Items
                </Link>
                <Link to="/notifications" className="block text-center py-2 bg-gray-200 rounded-md">
                  Notifications
                </Link>
                <Link to={`/profile/${authUser.email}`} className="block text-center py-2 bg-gray-200 rounded-md">
                  Profile
                </Link>
                <button onClick={logout} className="block w-full text-center py-2 bg-red-500 text-white rounded-md">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-center py-2 bg-blue-500 text-black rounded-md">
                Sign In / Sign Up
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

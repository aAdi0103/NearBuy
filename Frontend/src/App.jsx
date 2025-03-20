import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import HomePage from './Components/HomePage'
import Product from './Pages/Product'
import Service from './Pages/Service'
import Sections from './Layouts/Sections'
import LoginPage from './Pages/authPage/loginPage'
import SignPage from './Pages/authPage/SignPage'
import ProfilePage from './Pages/ProfilePage'
import EditProfile from './Pages/EditProfile'
import EditServices from './Pages/EditServices'
import EditProducts from './Pages/EditProducts'
import Listing from './Pages/Listings/Listing'
import { toast, Toaster } from 'react-hot-toast'
import ServicesListings from './Pages/Listings/ServicesListings'
import ProductListing from './Pages/Listings/ProductListing'
import ServiceDetails from './Pages/showDetails/ServiceDetails'
import ProductDetails from './Pages/showDetails/ProductDetails'
import ViewallServices from './Pages/ViewallServices'
import ViewAllProducts from './Pages/ViewAllProducts'
import SearchedServices from './Pages/SearchedServices'
import Booking from './Pages/Listings/Booking'
import Notification from './Pages/Notfication';
function App() {
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
        toast.error(err.response.data.message || 'Something went wrong')
      }
    },
  })

  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => setError(err.message)
    )
  }, [])

  if (isLoading) return null

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<HomePage userLocation={location} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />}></Route>
        <Route path="/signup" element={!authUser ? <SignPage /> : <Navigate to={'/'} />} />
        <Route path="/profile/:email" element={<ProfilePage />} />
        <Route path="/edit/:id" element={authUser ? <EditProfile /> : <Navigate to={'/login'} />} />
        <Route
          path="/edit/services/:id"
          element={authUser ? <EditServices /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/edit/Products/:id"
          element={authUser ? <EditProducts /> : <Navigate to={'/login'} />}
        />

        <Route path="/list" element={authUser ? <Listing /> : <Navigate to={'/login'} />} />
        <Route
          path="/list/Services"
          element={authUser ? <ServicesListings /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/list/Products"
          element={authUser ? <ProductListing /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/edit/product/:id"
          element={authUser ? <EditProducts /> : <Navigate to={'/login'} />}
        />
        <Route path="/sections" element={<Sections />}>
          <Route path="product" element={<Product />} />
          <Route path="services" element={<Service />} />
        </Route>
        <Route
          path="/service/:id"
          element={authUser ? <ServiceDetails /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/product/:id"
          element={authUser ? <ProductDetails /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/viewall/services"
          element={authUser ? <ViewallServices /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/viewall/Products"
          element={authUser ? <ViewAllProducts /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/searchedResults"
          element={authUser ? <SearchedServices /> : <Navigate to={'/login'} />}
        />
        <Route path="/Booking/:id/:ids" element={authUser ? <Booking /> : <Navigate to={'/login'} />} />
        <Route path="/notifications" element={authUser ? <Notification /> : <Navigate to={'/login'} />} />
      </Routes>
    </>
  )
}

export default App

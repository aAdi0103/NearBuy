import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { axiosInstance } from '../lib/axios'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useNavigate } from 'react-router-dom'

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const Header = ({ authUser }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [serviceProviders, setServiceProviders] = useState([])
  const navigate = useNavigate()

  const [searchType, setSearchType] = useState('') // "service" or "product"
  const [location, setLocation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: services,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await axiosInstance.get('/services/getAllServices')
      return res.data
    },
  })

  // Get user's location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If user grants location permission
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude
          setUserLocation([userLat, userLng])

          // Update service providers dynamically
          if (services) {
            setServiceProviders(
              services.map((service, index) => ({
                id: service.id || index, // Ensure unique ID
                name: service.title,
                location: [service.latitude, service.longitude], // Use API-provided lat/lng
              }))
            )
          }
        },
        () => {
          // If user denies location permission, use authUser's location
          if (authUser?.latitude && authUser?.longitude) {
            setUserLocation([authUser.latitude, authUser.longitude])

            if (services) {
              setServiceProviders(
                services.map((service, index) => ({
                  id: service.id || index,
                  name: service.title,
                  location: [service.latitude, service.longitude],
                }))
              )
            }
          } else {
            alert('Location access denied')
          }
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }, [services, authUser]) // Run again if services or authUser changes
  // Re-run when services data updates

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchType) {
      alert('Please select either Service or Product.')
      return
    }

    try {
      const apiUrl =
        searchType === 'service' ? '/services/getSearchedServices' : '/posts/getSearchedProducts'

      const { data } = await axiosInstance.get(apiUrl, {
        params: { location, search: searchQuery },
      })

      console.log('Fetched Data:', data)
      navigate('/searchedResults', { state: { data } })
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message)
    }
  }

  return (
    <div className="mx-auto mb-16 mt-5 flex min-h-[90vh] max-w-6xl flex-col items-center justify-between gap-10 px-3 py-2 max-md:gap-0 md:flex-row">
      {/* Left Side - Search Section */}
      <div className="min-h-[50vh] w-full space-y-4 md:w-1/2">
        <h1 className="text-6xl font-extrabold max-md:text-4xl">
          Find Local Services & Goods Near You
        </h1>
        <p className="text-gray-600">
          Connect with trusted local service providers and products in your area.
        </p>

        {/* Checkboxes for Service or Product */}
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="searchType"
              value="service"
              checked={searchType === 'service'}
              onChange={(e) => setSearchType(e.target.value)}
              className="h-4 w-4"
            />
            <span>Service</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="searchType"
              value="product"
              checked={searchType === 'product'}
              onChange={(e) => setSearchType(e.target.value)}
              className="h-4 w-4"
            />
            <span>Product</span>
          </label>
        </div>

        {/* Search Fields */}
        <form className="flex flex-col space-y-3" onSubmit={handleSearch}>
          {/* Location Input */}
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none"
          />

          {/* Search Query Input (Service or Product) */}
          <input
            type="text"
            placeholder={
              searchType === 'product' ? 'Search for a product...' : 'Search for a service...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!searchType} // Disable if no checkbox is selected
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none"
          />

          {/* Search Button */}
          <button
  type="submit"
  className="rounded-lg bg-gradient-to-r from-blue-800 to-blue-500 px-6 py-3 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-blue-400/50 focus:ring-2 focus:ring-blue-400 active:scale-95"
>
   Search
</button>

        </form>

        {/* Categories */}
        <div className="mt-2 flex space-x-2">
          {['Cleaning', 'Repair', 'Tutoring', 'Fitness'].map((category) => (
            <button
              key={category}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Map Section */}
      <div className="mt-6 flex w-full flex-col items-center md:mt-0 md:w-1/2">
        {/* Show Map only if modal is not open */}
        {!isModalOpen && (
          <div className="flex h-[65vh] w-full items-center justify-center rounded-lg bg-gray-200 shadow-lg shadow-gray-400 max-md:h-[30vh]">
          {userLocation ? (
            <MapContainer center={userLocation} zoom={13} className="h-full w-full rounded-lg">
              {/* Tile Layer (Map Design) */}
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
              {/* User's Location */}
              <Marker position={userLocation} icon={defaultIcon}>
                <Popup>You are here</Popup>
              </Marker>
        
              {/* Service Provider Markers */}
              {serviceProviders.map((provider) => (
                <Marker key={provider.id} position={provider.location} icon={defaultIcon}>
                  <Popup>{provider.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <p className="font-semibold text-red-600">Please allow location or sign in...</p>
          )}
        </div>
        
        )}

<button
  onClick={() => setIsModalOpen(true)}
  className="mt-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-900 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 hover:from-blue-900 hover:to-blue-600 focus:ring-2 focus:ring-blue-500 active:scale-95"
>
  View Services Near You on Map
</button>




      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
       <div className="min-h-[80vh] w-11/12 rounded-md bg-white p-6 text-center shadow-lg relative">
         {/* Close Button at the top right corner */}
         <button
           onClick={() => setIsModalOpen(false)}
           className="absolute top-2 right-2 text-lg p-2 rounded-md font-semibold bg-black text-white hover:text-red-700 focus:outline-none"
         >
           Close
         </button>
     
         <h2 className="mb-4 text-xl font-semibold">Map View</h2>
         {userLocation ? (
           <MapContainer center={userLocation} zoom={13} className="h-[80vh] w-full rounded-lg">
             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
             <Marker position={userLocation} icon={defaultIcon}>
               <Popup>You are here</Popup>
             </Marker>
             {serviceProviders.map((provider) => (
               <Marker key={provider.id} position={provider.location} icon={defaultIcon}>
                 <Popup>{provider.name}</Popup>
               </Marker>
             ))}
           </MapContainer>
         ) : (
           <p className="text-gray-500">Fetching location...</p>
         )}
       </div>
     </div>
     
     
      )}
    </div>
  )
}

export default Header

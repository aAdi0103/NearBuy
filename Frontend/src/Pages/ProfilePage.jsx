import {
  Facebook,
  Instagram,
  Linkedin,
  Settings,
  Pencil,
  Trash,
  Clock,
  Tag,
  Globe,
  IndianRupee,
  ImageIcon,
  Loader2,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import { useParams } from 'react-router-dom'
import ConatctPage from './ContactPage'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'
import Navbar from '../Layouts/Navbar'

const ProfilePage = () => {
  const productsRef = useRef(null)
  const servicesRef = useRef(null)

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const { email } = useParams()
  const queryClient = useQueryClient()

  // Ensure email is defined before running queries
  const isEmailAvailable = Boolean(email)

  const { data: authUser, isLoading: isAuthLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me', {
          headers: { 'Content-Type': 'application/json' },
        })
        return res.data
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null
        }
        toast.error(err.response?.data?.message || 'Something went wrong')
        return null
      }
    },
  })

  // Fetch FromEmail data only when email is available
  const { data: FromEmail } = useQuery({
    queryKey: ['FromEmail', email],
    queryFn: async () => {
      if (!isEmailAvailable) return null // Prevent API call if email is missing

      try {
        console.log('Fetching user data for email:', email)
        const res = await axiosInstance.get(`/users/gett/${email}`, {
          headers: { 'Content-Type': 'application/json' },
        })
        return res.data || null
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null
        }
        toast.error(err.response?.data?.message || 'Something went wrong')
        return null
      }
    },
    enabled: isEmailAvailable, // Ensure query runs only when email is available
  })

  // Fetch posts only when email is fully available
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['posts', email],
    queryFn: async () => {
      if (!isEmailAvailable) return [] // Prevent API call if email is missing
      console.log('Fetching posts for email:', email)

      const response = await axiosInstance.get(`/posts/getPosts/${email}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      return response.data
    },
    enabled: isEmailAvailable,
  })


  const { data: Services, isLoading: isServicesLoading } = useQuery({
    queryKey: ['Services', email],
    queryFn: async () => {
      if (!isEmailAvailable) return [] // Prevent API call if email is missing
      console.log('Fetching Services for email:', email)

      const response = await axiosInstance.get(`/services/getServices/${email}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      return response.data
    },
    enabled: isEmailAvailable,
  })

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async (postId) => {
      console.log(postId)
      await axiosInstance.delete(`/posts/delete/${postId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const { mutate: deleteService, isPending: isDeletingService } = useMutation({
    mutationFn: async (serviceId) => {
      await axiosInstance.delete(`/services/delete/${serviceId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Services'] })
      toast.success('Post deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDeletePost = (postId) => {
    console.log(postId)
    if (!window.confirm('Are you sure you want to delete this post?')) return
    deletePost(postId)
  }

  const handleDeleteService = (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    deleteService(serviceId)
  }

  if (isAuthLoading || isPostsLoading) return <p>Loading...</p>
  if (!authUser) return <p>User not logged in</p>

  return (
    <>
      <Navbar></Navbar>
      <Toaster></Toaster>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 bg-zinc-100 p-4 md:p-6">
        {/* Profile Section */}
        <div className="mt-[-10px] flex flex-col items-center gap-8 rounded-lg bg-white p-6 text-center shadow-lg md:flex-row md:items-start md:gap-16 md:text-left">
          {/* Profile Image & Socials */}
          <div className="flex flex-col items-center text-center md:w-1/3">
            {FromEmail ? (
              <>
                <img
                  src={FromEmail.profilePic || '/avtar.png'}
                  alt="Trainer"
                  className="h-32 w-32 rounded-full border-4 border-gray-300"
                />

                {/* Social Icons */}
                <div className="mt-4 flex gap-4">
                  <a href="#" className="hover:text-gray-500">
                    <Facebook size={30} />
                  </a>
                  <a href="#" className="hover:text-gray-500">
                    <Instagram size={30} />
                  </a>
                  <a href="#" className="hover:text-gray-500">
                    <Linkedin size={30} />
                  </a>
                </div>

                {/* Buttons */}
                <ConatctPage phoneNumber={FromEmail.Phone} email={FromEmail.email} />
              </>
            ) : (
              <p className="text-gray-500">No profile data available</p>
            )}
          </div>

          {/* Middle Section: Name & Details */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{FromEmail.name}</h2>
            <p className="text-gray-500">{FromEmail.role}</p>
            <p className="flex items-center gap-1 text-gray-600">
              📍{FromEmail.location.area},{FromEmail.location.city}, {FromEmail.location.state},{' '}
              {FromEmail.location.country}
            </p>

            {/* Reviews Section */}
            <div className="mt-4">
              <h1 className="font-bold">Reviews</h1>
            </div>
          </div>

          {FromEmail?.email === authUser?.email && (
            <a
              className="flex items-center gap-2 text-blue-700 underline"
              href={`/edit/${authUser?._id}`}
            >
              <Pencil className="h-4 w-4" />
              Edit Your Profile
            </a>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="font-semibold text-zinc-600">What you are looking for?</h1>
          <div className="mt-[-10px] flex gap-9">
            <button
              onClick={() => scrollToSection(productsRef)}
              className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 text-white shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection(servicesRef)}
              className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 text-white shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg"
            >
              Services
            </button>
          </div>
        </div>

        {FromEmail && (
          <div>
            <div
              ref={productsRef}
              id="products"
              className="flex flex-col rounded-lg bg-white p-4 shadow-lg lg:col-span-2"
            >
              <h3 className="text-xl font-bold">Products Listed By {FromEmail.name}</h3>

              {isPostsLoading ? (
                <p className="text-gray-500">Loading Products...</p>
              ) : posts.length === 0 ? (
                <p className="text-gray-500">No Products available.</p>
              ) : (
                <div className="mt-10 space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="flex w-full flex-col items-start justify-between border-b pb-4 md:flex-row md:items-center"
                    >
                      <div className="flex w-full gap-4">
                        <img
                          src={(post.images && post.images) || 'https://via.placeholder.com/100'}
                          alt={post.title || 'Post Image'}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                        <div className="flex w-full flex-col justify-between">
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="line-clamp-3 text-sm text-zinc-800">{post.heading}</p>

                          <p className="mt-2 flex items-center gap-2 font-bold text-zinc-800">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                            {post.price}{' '}
                          </p>

                          <div className="mt-1 flex gap-2 text-sm text-zinc-600">
                            <p>Condition: {post.condition}</p>
                            <p>Category: {post.category}</p>
                          </div>
                        </div>
                      </div>

                      {authUser._id === post.author && (
                        <div className="mt-3 flex gap-3 md:mt-0">
                          <a
                            href={`/edit/product/${post._id}`}
                            className="flex items-center gap-1 text-sm text-blue-500 transition hover:text-blue-700"
                          >
                            <Pencil size={16} />
                            Edit
                          </a>

                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="flex items-center gap-1 text-sm text-red-500 transition hover:text-red-700"
                          >
                            <Trash size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services Section */}

        <div
          ref={servicesRef}
          id="services"
          className="w-full rounded-lg bg-white p-4 shadow-lg lg:col-span-2"
        >
          <h3 className="flex items-center gap-2 text-xl font-bold">
            Services Listed by {FromEmail.name}
          </h3>

          {isServicesLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <p>Loading services...</p>
            </div>
          ) : Services.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <ImageIcon className="mr-2 h-6 w-6" />
              <p>No services available.</p>
            </div>
          ) : (
            <div className="mt-10 space-y-6">
              {Services.map((service) => (
                <div
                  key={service._id}
                  className="flex flex-col items-start justify-between rounded-lg border-b p-4 pb-6 transition-colors hover:bg-gray-50 md:flex-row"
                >
                  <div className="flex w-full flex-col gap-6 md:flex-row">
                    <img
                      src={service.images || 'https://via.placeholder.com/100'}
                      alt={service.title || 'Service Image'}
                      className="h-28 w-28 rounded-lg object-cover shadow-md"
                    />
                    <div className="flex w-full flex-col justify-between space-y-2">
                      <h4 className="text-lg font-semibold">{service.title}</h4>
                      <p className="line-clamp-3 text-sm text-zinc-600">{service.description}</p>
                      <div className="flex flex-col items-start font-bold text-zinc-800">
                        <p className="flex items-center gap-1 text-lg font-bold text-zinc-800">
                          <IndianRupee className="h-5 w-5 text-green-600" />
                          <span className="text-xl font-semibold">{service.price}</span> /
                          <span className="mt-2 text-sm text-gray-500">{service.duration}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-zinc-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <p className="text-sm">{service.duration}</p>
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          <p className="text-sm">Category: {service.category}</p>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 text-zinc-600">
                        <Globe className="h-4 w-4" />
                        <p className="text-sm">
                          {service.language.map((lang, index) => (
                            <span key={index} className="mr-1">
                              {lang}
                              {index < service.language.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {authUser._id === service.provider && (
                    <div className="mt-4 flex w-full flex-col gap-4 md:mt-0 md:w-auto md:flex-row">
                      <Link
                        to={`/edit/services/${service._id}`}
                        className="flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="text-sm">Edit</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfilePage

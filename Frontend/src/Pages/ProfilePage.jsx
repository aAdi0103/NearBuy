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
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useParams } from "react-router-dom";
import ConatctPage from "./ContactPage";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Navbar from "../Layouts/Navbar";

const ProfilePage = () => {
  const productsRef = useRef(null);
  const servicesRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { email } = useParams();
  const queryClient = useQueryClient();
  
  // Ensure email is defined before running queries
  const isEmailAvailable = Boolean(email);
  
  const { data: authUser, isLoading: isAuthLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me", {
          headers: { "Content-Type": "application/json" },
        });
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response?.data?.message || "Something went wrong");
        return null;
      }
    },
  });
  
  // Fetch FromEmail data only when email is available
  const { data: FromEmail } = useQuery({
    queryKey: ["FromEmail", email],
    queryFn: async () => {
      if (!isEmailAvailable) return null; // Prevent API call if email is missing
  
      try {
        console.log("Fetching user data for email:", email);
        const res = await axiosInstance.get(`/users/gett/${email}`, {
          headers: { "Content-Type": "application/json" },
        });
        return res.data || null;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response?.data?.message || "Something went wrong");
        return null;
      }
    },
    enabled: isEmailAvailable, // Ensure query runs only when email is available
  });
  
  // Fetch posts only when email is fully available
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts", email],
    queryFn: async () => {
      if (!isEmailAvailable) return []; // Prevent API call if email is missing
      console.log("Fetching posts for email:", email);

        const response = await axiosInstance.get(`/posts/getPosts/${email}`,{
          headers: { "Content-Type": "application/json" },
  
        });
      return response.data;
    },
    enabled: isEmailAvailable,
  });
  
  console.log(posts)
      
  

  const { data: Services, isLoading: isServicesLoading } = useQuery({
    queryKey: ["Services", email],
    queryFn: async () => {
      if (!isEmailAvailable) return []; // Prevent API call if email is missing
      console.log("Fetching Services for email:", email);

        const response = await axiosInstance.get(`/services/getServices/${email}`,{
          headers: { "Content-Type": "application/json" },
  
        });
      return response.data;
    },
    enabled: isEmailAvailable,
  });
  console.log(Services)


  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async (postId) => {
      console.log(postId);
      await axiosInstance.delete(`/posts/delete/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteService, isPending: isDeletingService } = useMutation({
    mutationFn: async (serviceId) => {
      await axiosInstance.delete(`/services/delete/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Services"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = (postId) => {
    console.log(postId);
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost(postId);
  };

  const handleDeleteService = (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deleteService(serviceId);
  };

  if (isAuthLoading || isPostsLoading) return <p>Loading...</p>;
  if (!authUser) return <p>User not logged in</p>;


  return (
    <>
      <Navbar></Navbar>
      <Toaster></Toaster>
      <div className="max-w-7xl bg-zinc-100 mx-auto p-4 md:p-6 flex flex-col gap-6">


        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg mt-[-10px] shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 text-center md:text-left">
  {/* Profile Image & Socials */}
  <div className="flex flex-col items-center md:w-1/3 text-center">
    {FromEmail ? (
      <>
        <img
          src={FromEmail.profilePic || "/avtar.png"}
          alt="Trainer"
          className="w-32 h-32 rounded-full border-4 border-gray-300"
        />

        {/* Social Icons */}
        <div className="flex gap-4 mt-4">
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
    <p className="text-gray-600 flex items-center gap-1">
      📍{FromEmail.location.area},{FromEmail.location.city}, {FromEmail.location.state},{" "}
      {FromEmail.location.country}
    </p>

    {/* Reviews Section */}
    <div className="mt-4">
      <h1 className="font-bold">Reviews</h1>
    </div>
  </div>

  {FromEmail?.email === authUser?.email && (
  <a
    className="text-blue-700 underline flex items-center gap-2"
    href={`/edit/${authUser?._id}`}
  >
    <Pencil className="w-4 h-4" />
    Edit Your Profile
  </a>
)}


</div>




        {/* Navigation Links */}
        <div className="flex flex-col gap-5 justify-center items-center">
          <h1 className="font-semibold text-zinc-600">
            What you are looking for?
          </h1>
          <div className="flex gap-9 mt-[-10px]">
          <button
  onClick={() => scrollToSection(productsRef)}
  className="text-white px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-md hover:scale-105 transition-transform duration-200 hover:shadow-lg"
>
  Products
</button>
<button
  onClick={() => scrollToSection(servicesRef)}
  className="text-white px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-md hover:scale-105 transition-transform duration-200 hover:shadow-lg"
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
      className="bg-white p-4 rounded-lg flex flex-col shadow-lg lg:col-span-2"
    >
      <h3 className="text-xl font-bold">
        Products Listed By {FromEmail.name}
      </h3>

      {isPostsLoading ? (
        <p className="text-gray-500">Loading Products...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No Products available.</p>
      ) : (
        <div className="mt-10 space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 w-full"
            >
              <div className="flex gap-4 w-full">
                <img
                  src={
                    (post.images && post.images) ||
                    "https://via.placeholder.com/100"
                  }
                  alt={post.title || "Post Image"}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex flex-col justify-between w-full">
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-zinc-800 text-sm line-clamp-3">
                    {post.heading}
                  </p>

                  <p className="text-zinc-800 font-bold flex items-center gap-2 mt-2">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    {post.price}{" "}
                  </p>

                  <div className="flex gap-2 text-zinc-600 text-sm mt-1">
                    <p>Condition: {post.condition}</p>
                    <p>Category: {post.category}</p>
                  </div>
                </div>
              </div>

              {authUser._id === post.author && (
                <div className="flex gap-3 mt-3 md:mt-0">
                  <a
                    href={`/edit/product/${post._id}`}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </a>

                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm transition"
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
  className="bg-white p-4 rounded-lg shadow-lg lg:col-span-2 w-full"
>
  <h3 className="text-xl font-bold flex items-center gap-2">
    Services Listed by {FromEmail.name}
  </h3>

  {isServicesLoading ? (
    <div className="flex items-center justify-center py-8 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      <p>Loading services...</p>
    </div>
  ) : Services.length === 0 ? (
    <div className="flex items-center justify-center py-8 text-gray-500">
      <ImageIcon className="w-6 h-6 mr-2" />
      <p>No services available.</p>
    </div>
  ) : (
    <div className="mt-10 space-y-6">
      {Services.map((service) => (
        <div
          key={service._id}
          className="flex flex-col md:flex-row justify-between items-start border-b pb-6 hover:bg-gray-50 p-4 rounded-lg transition-colors"
        >
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <img
              src={service.images || "https://via.placeholder.com/100"}
              alt={service.title || "Service Image"}
              className="w-28 h-28 object-cover rounded-lg shadow-md"
            />
            <div className="flex flex-col justify-between space-y-2 w-full">
              <h4 className="font-semibold text-lg">{service.title}</h4>
              <p className="text-zinc-600 text-sm line-clamp-3">
                {service.description}
              </p>
              <div className="text-zinc-800 font-bold flex flex-col items-start">
                <p className="text-zinc-800 font-bold flex items-center gap-1 text-lg">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  <span className="text-xl font-semibold">{service.price}</span>{" "}
                  /
                  <span className="text-sm text-gray-500 mt-2">
                    {service.duration}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-zinc-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">{service.duration}</p>
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <p className="text-sm">Category: {service.category}</p>
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-600 flex-wrap">
                <Globe className="w-4 h-4" />
                <p className="text-sm">
                  {service.language.map((lang, index) => (
                    <span key={index} className="mr-1">
                      {lang}
                      {index < service.language.length - 1 ? "," : ""}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          {authUser._id === service.provider && (
            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
              <Link
  to={`/edit/services/${service._id}`}
  className="text-blue-500 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors justify-center"
>
  <Pencil className="w-4 h-4" />
  <span className="text-sm">Edit</span>
</Link>

              <button
                onClick={() => handleDeleteService(service._id)}
                className="text-red-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors justify-center"
              >
                <Trash className="w-4 h-4" />
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
  );
};

export default ProfilePage;

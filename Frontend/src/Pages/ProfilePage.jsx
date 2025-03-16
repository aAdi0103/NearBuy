import { Facebook, Instagram, Linkedin, Pencil, Settings, Trash } from "lucide-react";
import { Link } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useParams } from "react-router-dom";
import ConatctPage from "./ContactPage";
  const ProfilePage = () => {
    const { email } = useParams();
    const queryClient = useQueryClient();


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
        }
      },
    });

    console.log(authUser)


    const { data: posts, isLoading: isPostsLoading } = useQuery({
      queryKey: ["posts"],
      queryFn: async () => {
        const res = await axiosInstance.get("/posts/getPosts");
        return res.data;
      },
    });

    const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
      mutationFn: async (postId) => {
        console.log(postId)
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
    


    const handleDeletePost = (postId) => {
      console.log(postId);
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      deletePost(postId);
    };

    if (isAuthLoading || isPostsLoading) return <p>Loading...</p>;
    if (!authUser) return <p>User not logged in</p>;


    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6">


        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 text-center md:text-left">
          {/* Profile Image & Socials */}
          <div className="flex flex-col items-center md:w-1/3 text-center">
            <img
              src={authUser.profilePic || "/avtar.png"}
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
            <ConatctPage phoneNumber={authUser.Phone} email={authUser.email} />
          </div>

          {/* Middle Section: Name & Details */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{authUser.name}</h2>
            <p className="text-gray-500">{authUser.role}</p>
            <p className="text-gray-600 flex items-center gap-1">
              📍 {authUser.location.city}, {authUser.location.state},{" "}
              {authUser.location.country}
            </p>

            {/* Reviews Section */}
            <div className="mt-4">
              <h1 className="font-bold">Reviews</h1>
            </div>
          </div>

          <a
            className="text-blue-700 underline flex items-center gap-2"
            href={`/edit/${authUser?._id}`}
          >
            <Pencil className="w-4 h-4" />
            {authUser && decodeURIComponent(email) === authUser.email
              ? "Edit Your Profile"
              : ""}
          </a>
        </div>

        {/* About, Products, & Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About Section */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">About</h3>
            <p className="text-gray-600 mt-2">{authUser.About}</p>
            <h4 className="font-semibold mt-4">Location</h4>
            <p className="text-gray-600">
              📍 {authUser.location.city}, {authUser.location.state},{" "}
              {authUser.location.country}{" "}
            </p>
            <p className="mt-6 text-blue-400 font-semibold">
              <a href="">Contact me for more details...</a>
            </p>
          </div>

          {/* Product Section */}
          <div className="bg-white p-4 rounded-lg flex flex-col shadow-lg lg:col-span-2">
    <h3 className="text-xl font-bold">Products Posted By You</h3>

    {/* Loading state */}
    {isPostsLoading ? (
      <p className="text-gray-500">Loading services...</p>
    ) : posts.length === 0 ? (
      <p className="text-gray-500">No services available.</p>
    ) : (
      <div className="mt-10 space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="flex justify-between items-start border-b pb-4"
          >
            {/* Left: Product Info */}
            <div className="flex gap-4">
              <img
                src={post.images || "https://via.placeholder.com/100"}
                alt={post.title || "Service Image"}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex flex-col justify-between">
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-zinc-800 text-sm line-clamp-3">{post.description}</p>
                <p className="text-zinc-800 font-bold">₹ {post.price}</p>
                <div className="flex gap-2 text-zinc-600">
                  <p className="text-sm">Condition: {post.condition}, </p>
                  <p className="text-sm">Category: {post.category}</p>
                </div>
              </div>
            </div>

            {authUser ._id === post.author && (
              <div className="flex gap-5">
                {/* Edit Button */}
                <button>
                  <a
                    href={`/edit/product/${post._id}`}
                    className="text-blue-500 hover:text-blue-700 flex items-center underline gap-1 text-sm transition"
                  >
                    <Pencil size={16} /> Edit
                  </a>
                </button>

                {/* Delete Button */}
                <button onClick={() => handleDeletePost(post._id)}>
                  <a className="text-red-500 hover:text-blue-700 flex items-center underline gap-1 text-sm transition">
                    <Trash size={16} /> Delete
                  </a>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>

      </div>

      {/* Services Section */}
      <div className="bg-white p-4 flex items-start rounded-lg shadow-lg">
        <div>
          <h3 className="text-xl font-bold">Products Listed by User</h3>
          <div className="mt-4">
            {/* Review 1 */}
            <div className="border-b pb-4 mb-4">
              <p className="font-semibold">Sarah Johnson</p>
              <p className="text-sm text-gray-500">December 15, 2023</p>
              <p className="text-gray-600 mt-2">
                "John is an exceptional trainer! His personalized approach
                helped me achieve my fitness goals faster than I expected."
              </p>
            </div>

            {/* Review 2 */}
            <div className="border-b pb-4 mb-4">
              <p className="font-semibold">Michael Chen</p>
              <p className="text-sm text-gray-500">December 10, 2023</p>
              <p className="text-gray-600 mt-2">
                "Great attention to detail and very knowledgeable about fitness
                and nutrition."
              </p>
            </div>
          </div>
        </div>
        <a
          href={`/edit/Products/${authUser._id}`}
          className="text-red-500 flex items-center gap-2 hover:text-red-700 transition"
        >
          <Settings size={20} /> {/* Icon */}
          Edit or Delete Your Products
        </a>
      </div>

    </div>
  );
};

export default ProfilePage;

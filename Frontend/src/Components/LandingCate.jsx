import { Home,Utensils,ArrowRight, Dumbbell, GraduationCap, Laptop2, BookOpen, ShoppingCart, ListChecks } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Newest from "../Layouts/Newest";

function CategoryCard({ icon, title, listings }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center gap-4 cursor-pointer">
      <div className="text-blue-600 w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{listings} listings</p>
      </div>
    </div>
  );
}
const sendEmail = () => {
  window.location.href = "mailto:ak0755591@gmail.com,aditya21sharma2003@gmail.com?subject=Hello&body=Type your message here...";
};

function App() {
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
  
  const categories = [
    { icon: <Home size={32} />, title: 'Home Cleaning Services', listings: 2845 }, // Broom for cleaning
    { icon: <Utensils  size={32} />, title: 'Home Maid Services', listings: 1573 }, // Home for maid services
    { icon: <Dumbbell size={32} />, title: 'Fitness Trainer', listings: 986 }, // Dumbbell for fitness
    { icon: <GraduationCap size={32} />, title: 'Education', listings: 1264 }, // GraduationCap for education
    { icon: <Laptop2 size={32} />, title: 'Electronic Products', listings: 3142 }, // Laptop2 for electronics
    { icon: <BookOpen size={32} />, title: 'Books', listings: 756 }, // BookOpen for books
    { icon: <ShoppingCart size={32} />, title: 'Goods', listings: 4231 }, // ShoppingCart for goods
    { icon: <ListChecks size={32} />, title: 'Others', listings: 892 }, // ListChecks for miscellaneous
];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Browse Categories
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              icon={category.icon}
              title={category.title}
              listings={category.listings}
            />
          ))}
        </div>
      </div>




     <Newest></Newest>



    {/* Features */}
    <div className="bg-zinc-100 mt-20 py-10 px-4 md:px-8 lg:px-16 rounded-lg shadow-sm">
      <h2 className="text-center text-3xl md:text-2xl font-bold text-gray-900">
       Our Features 
      </h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {/* Verified Providers */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Verified Providers</h3>
          <p className="text-gray-600 text-sm">All service providers are thoroughly vetted</p>
        </div>

        {/* Secure Payments */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Easy Booking</h3>
          <p className="text-gray-600 text-sm">Enjoy a seamless booking experience</p>
        </div>

        {/* Review System */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Hassle-Free Shopping</h3>
          <p className="text-gray-600 text-sm">Enjoy a risk-free purchase</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Review System</h3>
          <p className="text-gray-600 text-sm">Transparent feedback from real customers</p>
        </div>

        
      </div>
    </div>


    <footer className="bg-gray-900 mt-10 text-gray-400 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About LocalHub */}
        <div>
          <h3 className="text-white text-lg font-semibold">About LocalHub</h3>
          <ul className="mt-3 space-y-2">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Press</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white text-lg font-semibold">Support</h3>
          <ul className="mt-3 space-y-2">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Safety Center</a></li>
            <li><a href="#" className="hover:text-white">Community Guidelines</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
        {/* contact */}
        <div className="flex flex-col gap-6">
          <h3 className="text-white text-lg font-bold">Contact Us</h3>
         <div className="flex gap-5">
         <a href="#" className="hover:text-white">
      <Facebook size={30} />
    </a>
    <a href="#" className="hover:text-white">
      <Instagram size={30} />
    </a>
    <a href="#" className="hover:text-white">
      <Linkedin size={30} />
    </a>
         </div>
         <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 bg-gray-800 p-4 rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold text-white">MAIL US : </h1>
      <button
        onClick={sendEmail}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
      >
        Send Email
      </button>
    </div>

        </div>

      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
        <p className="text-sm">&copy; 2025 LocalHub. All rights reserved.</p>
      </div>
    </footer>


    </div>
  );
}

export default App;
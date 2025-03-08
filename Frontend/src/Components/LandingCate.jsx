import { Home,Utensils,ArrowRight, Dumbbell, GraduationCap, Laptop2, BookOpen, ShoppingCart, ListChecks } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "lucide-react";


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
      <div className="max-w-7xl mt-20 mx-auto sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold mb-6">Popular in New York</h2>
      <a className="text-blue-700 font-semibold flex items-center" href="">
          View All <ArrowRight className="ml-1" size={18} />
        </a>      </div>
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
import {
  Home,
  Utensils,
  ArrowRight,
  Dumbbell,
  GraduationCap,
  Laptop2,
  BookOpen,
  ShoppingCart,
  ListChecks,
} from 'lucide-react'
import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import Newest from '../Layouts/Newest'
import NewestProducts from '../Layouts/NewestProducts'

function CategoryCard({ icon, title, listings }) {
  return (
    <div className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center text-blue-600">{icon}</div>
      <div className="text-center">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{listings} listings</p>
      </div>
    </div>
  )
}
const sendEmail = () => {
  window.location.href =
    'mailto:ak0755591@gmail.com,aditya21sharma2003@gmail.com?subject=Hello&body=Type your message here...'
}

const LandingCate = ({ userLocation }) => {
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

  const categories = [
    {
      icon: <Home size={32} />,
      title: 'Home Cleaning Services',
      listings: 2845,
    }, // Broom for cleaning
    {
      icon: <Utensils size={32} />,
      title: 'Home Maid Services',
      listings: 1573,
    }, // Home for maid services
    { icon: <Dumbbell size={32} />, title: 'Fitness Trainer', listings: 986 }, // Dumbbell for fitness
    { icon: <GraduationCap size={32} />, title: 'Education', listings: 1264 }, // GraduationCap for education
    {
      icon: <Laptop2 size={32} />,
      title: 'Electronic Products',
      listings: 3142,
    }, // Laptop2 for electronics
    { icon: <BookOpen size={32} />, title: 'Books', listings: 756 }, // BookOpen for books
    { icon: <ShoppingCart size={32} />, title: 'Goods', listings: 4231 }, // ShoppingCart for goods
    { icon: <ListChecks size={32} />, title: 'Others', listings: 892 }, // ListChecks for miscellaneous
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900 md:text-3xl">
          Browse Categories
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
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

      <NewestProducts userLocation={userLocation} authUser={authUser}></NewestProducts>
      <Newest userLocation={userLocation} authUser={authUser}></Newest>

      {/* Features */}
      <div className="mt-20 rounded-lg bg-zinc-100 px-4 py-10 shadow-sm md:px-8 lg:px-16">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-2xl">Our Features</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 text-center md:grid-cols-2 lg:grid-cols-4">
          {/* Verified Providers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Verified Providers</h3>
            <p className="text-sm text-gray-600">All service providers are thoroughly vetted</p>
          </div>

          {/* Secure Payments */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Easy Booking</h3>
            <p className="text-sm text-gray-600">Enjoy a seamless booking experience</p>
          </div>

          {/* Review System */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Hassle-Free Shopping</h3>
            <p className="text-sm text-gray-600">Enjoy a risk-free purchase</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Review System</h3>
            <p className="text-sm text-gray-600">Transparent feedback from real customers</p>
          </div>
        </div>
      </div>

      <footer className="mt-10 bg-gray-900 px-6 py-10 text-gray-400">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
          {/* About LocalHub */}
          <div>
            <h3 className="text-lg font-semibold text-white">About LocalHub</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Safety Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          {/* contact */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-white">Contact Us</h3>
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
            <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-800 p-4 shadow-lg sm:flex-row sm:gap-5">
              <h1 className="text-xl font-semibold text-white">MAIL US : </h1>
              <button
                onClick={sendEmail}
                className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-blue-600"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between border-t border-gray-700 pt-6 md:flex-row">
          <p className="text-sm">&copy; 2025 LocalHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingCate

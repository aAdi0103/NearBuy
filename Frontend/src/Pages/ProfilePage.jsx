import { Facebook, Instagram, Linkedin } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6">

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 text-center md:text-left">
        
        {/* Profile Image & Socials */}
        <div className="flex flex-col items-center md:w-1/3 text-center">
          <img
            src="https://via.placeholder.com/100"
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
          <div className="mt-4 flex flex-col gap-2 w-full">
            <button className="bg-blue-600 text-white py-2 rounded-lg w-full md:w-40">
              Contact Now
            </button>
            <button className="border border-blue-600 text-blue-600 py-2 rounded-lg w-full md:w-40">
              Send Message
            </button>
          </div>
        </div>

        {/* Middle Section: Name & Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-500">Professional Personal Trainer</p>
          <p className="text-gray-600 flex items-center gap-1">
            📍 San Francisco, CA • 4.8 | 150 Reviews
          </p>

          {/* Reviews Section */}
          <div className="mt-4">
            <h1 className="font-bold">Reviews</h1>
          </div>
        </div>
      </div>

      {/* About, Services, & Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* About Section */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">About</h3>
          <p className="text-gray-600 mt-2">
            Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals through personalized training programs and nutrition guidance.
          </p>
          <h4 className="font-semibold mt-4">Location</h4>
          <p className="text-gray-600">San Francisco, CA</p>
          <p className="mt-6 text-blue-400 font-semibold">Contact for more details...</p>
        </div>

        {/* Services Section */}
        <div className="bg-white p-4 rounded-lg shadow-lg lg:col-span-2">
          <h3 className="text-xl font-bold">Services Offered</h3>
          <div className="mt-4">
            
            {/* Service 1 */}
            <div className="flex flex-col md:flex-row gap-4 border-b pb-4 mb-4">
              <img
                src="https://via.placeholder.com/100"
                alt="Workout"
                className="w-24 h-24 rounded-lg mx-auto md:mx-0"
              />
              <div>
                <h4 className="font-semibold">Full-Body Workout Plan</h4>
                <p className="text-gray-600 text-sm">
                  Personalized workout session focusing on strength and conditioning.
                </p>
                <p className="text-gray-800 font-bold">$50 / 1 Hour</p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src="https://via.placeholder.com/100"
                alt="Nutrition"
                className="w-24 h-24 rounded-lg mx-auto md:mx-0"
              />
              <div>
                <h4 className="font-semibold">Nutrition Consultation</h4>
                <p className="text-gray-600 text-sm">
                  Customized nutrition planning and dietary advice.
                </p>
                <p className="text-gray-800 font-bold">$40 / 45 Minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold">Reviews</h3>
        <div className="mt-4">
          
          {/* Review 1 */}
          <div className="border-b pb-4 mb-4">
            <p className="font-semibold">Sarah Johnson</p>
            <p className="text-sm text-gray-500">December 15, 2023</p>
            <p className="text-gray-600 mt-2">
              "John is an exceptional trainer! His personalized approach helped me achieve my fitness goals faster than I expected."
            </p>
          </div>

          {/* Review 2 */}
          <div className="border-b pb-4 mb-4">
            <p className="font-semibold">Michael Chen</p>
            <p className="text-sm text-gray-500">December 10, 2023</p>
            <p className="text-gray-600 mt-2">
              "Great attention to detail and very knowledgeable about fitness and nutrition."
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProfilePage;

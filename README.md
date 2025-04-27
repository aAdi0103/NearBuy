## ⚙️ Installation Guide
Step 1: Clone the repository
```bash
git clone https://github.com/<your-username>/NearBuy.git
```

Step 2: Set up environment variables
Create a `.env` file inside the backend directory and add the following:


```bash
PORT=3000
MONO_URI=<YOUR_MONGO_URI>
REDIS_HOST=<YOUR_REDIS_HOST>
REDIS_PORT=<YOUR_REDIS_PORT>
REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>
JWT_SECRET=<YOUR_JWT_SECRET>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
SIGNTENGINE_API_KEY=<YOUR_SIGNTENGINE_API_KEY>
SIGNTENGINE_API_SECRET=<YOUR_SIGNTENGINE_API_SECRET>
```
Step 3: Install dependencies
Backend

```bash
cd backend
npm install
npm run start
Frontend
```

```bash
cd frontend
npm install
npm run dev
```

Step 4: Access the Application
Local URL:
```bash
http://localhost:5173
```

Live Deployment:
```bash
https://nearbuy.onrender.com/
```
(Note: It may take a few seconds to load.)

📍 NearBuy — Your Hyperlocal Services & Goods Platform
NearBuy is a community-driven local commerce platform designed to connect users with nearby service providers and goods sellers. Whether you're looking for a personal trainer, a home-cooked meal, or second-hand electronics, NearBuy brings local discovery to your fingertips with seamless real-time experiences.

## ✨ Features
🛍️ Goods Marketplace: Buy & sell second-hand or new items (electronics, furniture, clothing, etc.)

🧹 Service Marketplace: Book local services like laundry, personal chefs, tutors, or fitness trainers

📍 Geo-Location Discovery: Auto-detects user location and displays services/goods on an interactive map

🔔 Notifications & Alerts: Get booking confirmations, reminders, and special deal alerts

🔐 Secure Authentication: JWT-based login with password encryption using BcryptJS

🗺️ Interactive Mapping: Powered by OpenStreetMap and Leaflet.js for nearby service discovery

🛡️ Moderation & Safety: Integrated image moderation and text verification for listing authenticity

📲 Mobile OTP Authentication (coming soon!)

## 💻 Tech Stack
Frontend: React.js + Tailwind CSS

Backend: Node.js + Express.js

Database: MongoDB

Authentication: JWT Tokens + BcryptJS

Map Integration: OpenStreetMap + Leaflet.js

Additional APIs:

Cloudinary (for image hosting)

Sightengine (for image moderation)

Address-to-Geolocation API (for user location mapping)


## 🗺️ User Flow

**For Buyers/Service Seekers:

Search for services or products nearby via map or search

View provider details, availability, pricing, and reviews

Book a service or purchase a product easily

Get real-time notifications and updates

**For Sellers/Service Providers:

Register and list services/products

Set custom pricing, availability, and manage bookings

Gain visibility and grow within the local community

## 📋 Page Structure
Landing Page (Map + Search + Featured Listings)

Goods Listing Page (Category-wise browsing)

Service Provider Profile Page (with ratings & portfolio)

Booking/Checkout Page (simple and secure)

User Dashboard (manage history, favorites, and bookings)

## 🔥 Real Use Cases
Find a Personal Trainer: Book a local fitness expert based on location, price, and reviews.

Buy a Second-Hand Laptop: Connect directly with local sellers without marketplace middlemen.

## 🧩 System Architecture
Authentication APIs: Signup, login, JWT session management

Goods APIs: Create, search, filter, and manage listings

Booking APIs: Schedule, reschedule, and manage service appointments

Geo-Location APIs: Fetch real-time nearby services dynamically

## 🚀 Challenges & Solutions
API Consistency: Implemented caching and retry mechanisms

Geo-location Scaling: Optimized mapping APIs using clustering for faster loads

Moderation: Used external APIs for safer listing verification

## 🔮 Future Scope
 🧠 AI-based personalized service recommendations

 🌍 Multi-language support for wider reach

 💬 In-app chat between buyers and service providers

 🏆 Premium subscription options for boosted visibility

 ⭐ Trust-building features like verified badges and detailed reviews

## 🤝 Contribution
We welcome your contributions!
Follow the standard GitHub flow: Fork → Branch → Commit → Pull Request.

## 🌟 Support
If you find NearBuy useful, please ⭐ star the repository and share it with your network!
Every bit of support helps us grow the platform.

## 🧾 License
This project is licensed under the MIT License.

## 🙌 Special Thanks
OpenStreetMap for free mapping solutions

Sightengine for providing smart content moderation APIs

Cloudinary for seamless media management

MongoDB and Render for hosting solutions

import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";

import HomePage from './Components/HomePage';
import Product from './Pages/Product'
import Service from './Pages/Service'
import Sections from './Layouts/Sections';
import LoginPage from './Pages/authPage/loginPage';
import SignPage from './Pages/authPage/SignPage'
import ProfilePage from './Pages/ProfilePage'
import EditProfile from './Pages/EditProfile';
import EditServices from './Pages/EditServices'
import EditProducts from './Pages/EditProducts';
import Listing from './Pages/Listings/Listing'
import { toast, Toaster } from "react-hot-toast";
import ServicesListings from './Pages/Listings/ServicesListings';
import ProductListing from './Pages/Listings/ProductListing'
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

  // console.log(authUser);
  
  if (isLoading) return null;



  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
   <Routes>
   <Route path="/" element={<HomePage/>}/>

   <Route path="/sections" element={<Sections />}>
          <Route path="product" element={<Product />} />
          <Route path="services" element={<Service />} />
   </Route>

   <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}></Route>
   <Route path="/signup" element={!authUser ? <SignPage /> : <Navigate to={"/"} />}/>
    <Route path='/profile/:email' element={<ProfilePage/>} />
    <Route path="/edit/:id" element={authUser ? <EditProfile /> : <Navigate to={"/login"}/>} />
    <Route path="/edit/services/:id" element={authUser ? <EditServices/>:<Navigate to={"/login"}/>} />
    <Route path="/edit/Products/:id" element={authUser ? <EditProducts/>:<Navigate to={"/login"}/>} />

    <Route path="/list" element={authUser ? <Listing/>: <Navigate to={"/login"} />} />
    <Route path="/list/Services" element={authUser ? <ServicesListings/>:<Navigate to={"/login"}/>} />
    <Route path="/list/Products" element={authUser ? <ProductListing/>:<Navigate to={"/login"}/>} />
    <Route path="/edit/product/:id" element={authUser ? <EditProducts/>:<Navigate to={'/login'} />} /> 
   </Routes>
   </>
  )
}

export default App

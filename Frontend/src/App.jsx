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

  if (isLoading) return null;



  return (
   <Routes>
   <Route path="/" element={<HomePage/>}/>
   <Route path="/sections" element={<Sections />}>
          <Route path="product" element={<Product />} />
          <Route path="services" element={<Service />} />
   </Route>
   <Route path='/login' element={<LoginPage/>}></Route>
   <Route
          path="/signup"
          element={!authUser ? <SignPage /> : <Navigate to={"/"} />}
        />
      <Route path='/profile' element={<ProfilePage/>} />

   </Routes>
  )
}

export default App

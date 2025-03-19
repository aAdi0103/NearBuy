import React from 'react'
import Navbar from './Navbar'
import Header from './Header'
import Section from './Sections'
import { useQuery } from "@tanstack/react-query";

const Top = () => {
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

  return (


    <div className= 'bg-[#F4F2EE]'>
      <Navbar></Navbar>
      <Header authUser={authUser} ></Header>
      <Section></Section>
    </div>
  )
}

export default Top

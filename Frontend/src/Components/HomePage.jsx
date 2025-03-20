import React from 'react'
import { Search, MapPin } from 'lucide-react'
import Top from '../Layouts/Top'
import LandingCate from './LandingCate'
const HomePage = ({ userLocation }) => {
  return (
    <div className="bg-[#F4F2EE]">
      <Top></Top>
      <LandingCate userLocation={userLocation}></LandingCate>
    </div>
  )
}

export default HomePage

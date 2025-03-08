import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './Components/HomePage';
import Product from './Pages/Product'
import Service from './Pages/Service'
import Sections from './Layouts/Sections';
function App() {
  return (
   <Routes>
   <Route path="/" element={<HomePage/>}/>
   <Route path="/sections" element={<Sections />}>
          <Route path="product" element={<Product />} />
          <Route path="services" element={<Service />} />
   </Route>
   </Routes>
  )
}

export default App

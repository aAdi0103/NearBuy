import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './Components/HomePage';
import Top from './Layouts/Top'
function App() {
  return (
   <Routes>
   <Route path="/" element={<HomePage/>}   />
   </Routes>
  )
}

export default App

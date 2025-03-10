// import { useState } from 'react'
// import Layout from './components/layout/Layout.jsx'
// import { Navigate, Route, Routes } from 'react-router-dom'

// import HomePage from './pages/HomePage.jsx'
// import LoginPage from './pages/auth/LoginPage.jsx'
// import SignUpPage from './pages/auth/SignUpPage.jsx'
// import toast,{ Toaster } from 'react-hot-toast'
// import { useQuery } from '@tanstack/react-query'
// import { axiosInstance } from './lib/axios.js'

// function App() {
//   const {data:authUser, isLoading} = useQuery({
//     queryKey: ['authUser'],
//     queryFn: async () => {
//       try {
//         const res = await axiosInstance.get("/auth/me");
//         return res.data;
//       } catch (err) {
//         if(err.response && err.response.status === 401) {
//           return null;
//         }
//         toast.error(err.response.data.message || "Something went wrong");
//       }
//     }
//   });
  
//   if(isLoading) return null;

//   return <Layout>
//     <Routes>
//       <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
//       <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
//       <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
//     </Routes>
//     <Toaster />
//   </Layout>
// }

// export default App

import {Route, Routes} from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'

import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import SignUpPage from './pages/auth/SignUpPage.jsx'

import toast,{ Toaster } from 'react-hot-toast'

function App () {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
      <Toaster />
    </Layout>
  )
}

export default App;
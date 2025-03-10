import React from 'react'
import Navbar from './Navbar'
//import { useQuery } from '@tanstack/react-query';
const Layout = ({children}) => {
  //it has already been fetched in App.jsx.
  //We are simply fetching it again using queryKey 
  // const {data:authUser, isLoading} = useQuery({queryKey: ['authUser'], queryFn: async () => {}});
  // console.log("auth user is in layout",authUser);

  return (
    <div className='min-h-screen bg-base-100'>
        <Navbar />
        <main className='max-w-7xl mx-auto px-4 py-6'>
            {children}
        </main>
    </div>
  )
}

export default Layout
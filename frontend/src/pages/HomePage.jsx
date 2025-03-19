import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios';
import React from 'react'
import Sidebar from '../components/Sidebar.jsx';
import PostCreation from '../components/PostCreation.jsx';

const HomePage = () => {
  const {data:authUser}=useQuery({
    queryKey: ['authUser'], 
    queryFn: async () => {
      return {};
    }
  });
  const {data:recommendedUsers}=useQuery({
    queryKey: ['recommendedUsers'],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
        return res.data;
    }
  });

  const {data:posts}=useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    }
  });
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>

      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar user={authUser}/>
      </div>

      <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
        <PostCreation user={authUser}/>
      </div>

    </div>
  )
}

export default HomePage
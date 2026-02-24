import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/authslice'
import { useEffect } from 'react'
import { fetchall } from '../features/HomeSlice'
import Card from '../components/Card'
import Loadingscrenn from '../components/Loadingscrenn'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import PostSearch from '../components/PostSearch'
const Home = () => {
  const { allposts, error, loading, h ,page} = useSelector((state) => state.home)
  const { user } = useSelector((state) => state.auth)
  const bottomref = useRef(null)
  

  const dispatch = useDispatch()

useEffect(() => {
  dispatch(fetchall({page}))
},[])

 
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && h) {

        dispatch(fetchall({page:page+1}))
      }
    }, {
      threshold: 1.0
    })

    if (bottomref.current) {
      observer.observe(bottomref.current)
    }

    return () => {
      if (bottomref.current) observer.unobserve(bottomref.current)
    }
  }, [loading, h])


  return (
    <div className='space-y-3 mt-25  '>

   

      <div className='mt-3'>
        <p className='text-4xl font-semibold text-center'>Feed</p>
      </div>
      <PostSearch/>

      <div className=' h-screen w-full '>
        <div className='space-y-6 '>
          {
            allposts?.map((post, i) => (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} key={post._id} >
                <Card post={post}  />
              </motion.div>

            ))
          }

          <div ref={bottomref} className="h-5" />
          <div className="text-center ">
            {loading && (<span className="loading loading-xl  loading-spinner"></span>)}

            {!h && (<p className="font-sans text-xl font-semibold">No more posts</p>)}
          </div>
        </div>

      </div>

    </div>
  )
}

export default Home

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchcom, fetchdetail } from '../features/HomeSlice'
import DetailedPost from '../components/DetailedPost'
import Comments from '../components/Comments'
import { useParams } from 'react-router-dom'
import Loadingscrenn from '../components/Loadingscrenn'
import { motion } from 'framer-motion'

const Deatiled = () => {
    const dispatch = useDispatch()
    const { postid } = useParams()
    const { post, loading, error, comments} = useSelector((state) => state.home)

    useEffect(() => {
        if (postid) {
            dispatch(fetchdetail(postid))
            dispatch(fetchcom(postid))
        }
    }, [postid])

    if (loading) return <Loadingscrenn />

    return (
     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto mt-20">
     
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Feed
        </motion.button>

      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <DetailedPost post={post} />
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Comments postid={postid} post={post} />
        </motion.div>

       
        <motion.div 
          className="md:hidden fixed bottom-4 left-4 right-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button 
            onClick={() => document.getElementById('comment-input')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-lg hover:bg-indigo-700 transition"
          >
            Add Comment
          </button>
        </motion.div>
      </div>
    </div>
    )
}

export default Deatiled;




    
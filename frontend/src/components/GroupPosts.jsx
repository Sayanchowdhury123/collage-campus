import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchGrpPosts } from '../features/GroupSlice';
import { motion } from 'framer-motion';
import Card from './Card';


const GroupPosts = ({ gid }) => {
    const navigate = useNavigate()
    const { pageloading,groupPosts } = useSelector((state) => state.group)
    const bottomref = useRef(null)
    const dispatch = useDispatch()





    useEffect(() => {
        if (gid) {
            dispatch(fetchGrpPosts(gid));

        }
    }, [dispatch, gid]);




    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Group Feed</h2>
                <div className="text-sm text-gray-500">
                    {groupPosts?.length || 0} posts
                </div>
            </div>

            {groupPosts?.length > 0 ? (
                <div className="space-y-6">
                    {
                        groupPosts?.map((post, i) => (
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} key={post._id} >
                                <Card post={post} />
                            </motion.div>

                        ))
                    }
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Be the first to share an update with your group!
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/add/post/${gid}`)}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Create First Post
                    </motion.button>
                </div>
            )}


            {pageloading && groupPosts?.length > 0 && (
                <motion.div
                    ref={bottomref}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center"
                >
                    {pageloading ? (
                        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
                    ) : (
                        <p className="text-gray-500 font-medium">No more posts to load</p>
                    )}
                </motion.div>
            )}
        </motion.div>
    )
}


export default GroupPosts;

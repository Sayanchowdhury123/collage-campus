import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchgroups, togglegrp } from '../features/GroupSlice'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import Loadingscrenn from '../components/Loadingscrenn'
import DeleteModal from '../components/DeleteModal'
import { openDeleteModal } from '../features/GroupSlice'
import DeleteGrpModal from '../components/Deletegrpmodal'
import toast from 'react-hot-toast'
import { fetchProfile } from '../features/profileSlice'


const Groups = () => {
    const navigate = useNavigate()
    const { groups, h, loading, showDeleteModal, deleteGrpId } = useSelector((state) => state.group)
    const dispatch = useDispatch()
    const { data } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.auth);
 
 
   

    useEffect(() => {
        dispatch(fetchgroups())
    

    }, [user.id])

  

    if (loading) return <Loadingscrenn />
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Groups</h1>
                        <p className="mt-1 text-gray-600">
                            Manage your campus communities and collaborations
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/add/group")}
                        className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Create Group
                    </motion.button>
                </motion.div>


                {groups?.length > 0 ? (
                    <div className='h-[80vh]'>
                        <motion.div

                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  overflow-y-scroll " style={{ scrollbarWidth: "none" }}
                        >
                            {groups.map((g) => (
                                <motion.div
                                    key={g._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                >

                                    <div className="h-32 overflow-hidden">
                                        {g.coverimage ? (
                                            <img
                                                src={g.coverimage}
                                                alt={g.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                                <span className="text-white text-4xl font-bold">
                                                    {g.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{g.name}</h3>
                                        <p className="text-gray-600 line-clamp-2">{g.description}</p>


                                        <div className="flex gap-3 mt-4">
                                            {g?.admin?._id === user?.id && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                                        onClick={() => dispatch(openDeleteModal(g?._id))}
                                                    >
                                                        Delete
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                                        onClick={() => navigate("/add/group", {
                                                            state: { g }
                                                        })}
                                                    >
                                                        Edit
                                                    </motion.button>

                                                </>
                                            )}


                                        </div>




                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-gray-400 mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-24 w-24 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M17 20h5v-2a3 3 0 00-3-3H6a3 3 0 00-3 3v2h5m10-10a3 3 0 013 3v2h-5m-5-5a3 3 0 00-3 3v2h5m-5-5a3 3 0 01-3 3v2h5"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No groups yet</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Create your first group to collaborate with classmates on projects, events, or study sessions.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/add/group")}
                            className="mt-6 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Create Your First Group
                        </motion.button>
                    </motion.div>
                )}



                {showDeleteModal && (<DeleteGrpModal />)}

            </div>
        </div>
    )
}

export default Groups




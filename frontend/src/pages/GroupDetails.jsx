import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchGrpDetails, togglegrp } from '../features/GroupSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loadingscrenn from '../components/Loadingscrenn';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaUsers } from "react-icons/fa";
import GroupPosts from '../components/GroupPosts';


const GroupDetails = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { gid } = useParams();

    const { allGroups, loading, grp } = useSelector((state) => state.group)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (gid) {
            dispatch(fetchGrpDetails(gid))
        }

    }, [gid])


    const isMember = grp?.members?.includes(user.id);

    const handleToggle = async (gid) => {

        const result = await dispatch(togglegrp({ gid, userid: user.id }))
        if (togglegrp.fulfilled.match(result)) {
            if (isMember) {
                toast.success("left successfully")
            } else {
                toast.success("joined succefully")
            }
        } else {
            toast.error("operation failed")
        }
    }

    if (loading) return <Loadingscrenn />
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto mt-20">
            
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => window.history.back()}
                    className="mb-6 cursor-pointer flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Groups
                </motion.button>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
                >
                    <div className="h-48 overflow-hidden">
                        {grp?.coverimage ? (
                            <img
                                src={grp.coverimage}
                                alt={grp.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-6xl font-bold">
                                    {grp?.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{grp?.name}</h1>
                                <p className="text-gray-600 mb-4 leading-relaxed">{grp?.description}</p>

                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                    <FaUsers className="text-gray-400" />
                                    <span>{grp?.members?.length || 0} members</span>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <img
                                        src={grp?.admin?.image || "/default-avatar.png"}
                                        alt={grp?.admin?.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">Created by {grp?.admin?.name}</p>
                                        <p className="text-xs text-gray-500">Group Admin</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 min-w-50 ">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleToggle(grp._id)}
                                    className={`px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${isMember
                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                        }`}
                                >
                                    {isMember ? "Leave Group" : "Join Group"}
                                </motion.button>

                                {isMember && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate(`/add/post/${gid}`)}
                                        className="px-6 py-3 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Create Post
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>


                {isMember && (
                    <GroupPosts gid={grp._id} />
                )}

            </div>
        </div>


    )
}

export default GroupDetails






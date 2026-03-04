import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deletefile, userResource } from '../features/ResourceSlice'
import { motion } from 'framer-motion'
import { FaFilePdf } from "react-icons/fa";
import { AiFillFilePpt } from "react-icons/ai";
import { IoIosDocument } from "react-icons/io";
import { BsFiletypeTxt } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import toast from 'react-hot-toast'
import Loadingscrenn from '../components/Loadingscrenn'


const YourResource = () => {
    const navigate = useNavigate()
    const { userItems,loading } = useSelector((state) => state.resource)
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(userResource())
    }, [user.id])

    const handledelete = async (resourceid) => {
        try {
            const res = await dispatch(deletefile(resourceid))
            if (deletefile.fulfilled.match(res)) {
                toast.success("deleted successfully")
            } else {
                toast.error("deletion failed")
            }
        } catch (error) {
             toast.error(error || "operation failed")
        }
    }

    if(loading) return <Loadingscrenn/>

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 ">
            <div className="max-w-4xl mx-auto mt-20">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Resources</h1>
                        <p className="mt-1 text-gray-600">
                            Manage your Resources and add pdf and ppts
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/resource/add")}
                        className=" cursor-pointer px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Create Resource
                    </motion.button>
                </motion.div>


                {userItems?.length > 0 ? (
                    <div className=''>
                        <motion.div

                            className='space-y-5'
                        >
                            {userItems.map((resource, index) => (
                                <motion.div
                                    key={resource._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05
                                    }}
                                    whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                                >
                                    <div className="p-5">
                                        <div className="flex items-start gap-4">

                                            <div className="shrink-0">
                                                <div className="bg-indigo-100 p-3 rounded-lg">
                                                    {resource.fileType === "pdf" && (<FaFilePdf />)}
                                                    {resource.fileType === "ppt" && (<AiFillFilePpt />)}
                                                    {resource.fileType === "pptx" && (<AiFillFilePpt />)}
                                                    {resource.fileType === "doc" && (<IoIosDocument />)}
                                                    {resource.fileType === "txt" && (<BsFiletypeTxt />)}
                                                  

                                                </div>
                                            </div>


                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                                                    {resource.title}
                                                </h3>

                                                <p className="text-gray-600 mb-3 line-clamp-2">
                                                    {resource.description || "No description available"}
                                                </p>


                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
                                                        {resource.subject}
                                                    </span>
                                                    <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                                                        Sem {resource.semester}
                                                    </span>
                                                    <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full">
                                                        {resource.course}
                                                    </span>
                                                </div>


                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-4">
                                                        <span>📥 {resource.downloads || 0} downloads</span>
                                                        <span>👍 {resource.upvotes?.length || 0} upvotes</span>
                                                    </div>
                                             <div className='flex items-center gap-4 '>
                                                 <button
                                                 onClick={() => navigate(`/resource/details/${resource._id}`)}
                                                    className=" cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Details
                                                </button>
                                               <button
                                                     onClick={() => navigate(`/resource/add`,{
                                                        state:{resource}
                                                     })}
                                                        className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Update
                                                    </button>

                                                     <button
                                                     onClick={() => handledelete(resource._id)}
                                                        className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                             </div>
                                                    
                                                </div>
                                            </div>
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
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Resources yet</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Create your Resource to share notes and lectures
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/resource/add")}
                            className="mt-6 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Create Your First Resource
                        </motion.button>
                    </motion.div>
                )}





            </div>
        </div>
    )
}

export default YourResource

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchpost, openDeleteModal, openEditModal } from '../features/PostSlice'
import Loadingscrenn from '../components/Loadingscrenn'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
import DeleteModal from '../components/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const PostManage = () => {
    const dispatch = useDispatch()
    const { posts, loading, error, pagination, showDeleteModal, showEditModal } = useSelector((state) => state.post)
    const { user } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchpost())
        }

    }, [dispatch, user?.id])

    if (loading) return <Loadingscrenn />

   
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 ">
            <div className="max-w-3xl mx-auto mt-20">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-3xl font-bold text-gray-900">Your Posts</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your campus updates and announcements
                    </p>
                </motion.div>


                {posts?.length > 0 ? (
                    <div className="space-y-6">
                        {posts.map((p) => (
                            <motion.div
                                key={p._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >

                                {p.cover && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={p.cover}
                                            alt="Post"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}


                                <div className="p-5">
                                    <div className='flex justify-between items-center'>
                                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                            {p.content}

                                        </p>

                                        {p?.groupid?._id && (
                                            <p className="text-gray-800 font-bold leading-relaxed whitespace-pre-line"> {p.groupid.name} Group</p>
                                        )}
                                    </div>



                                    <p className="text-xs text-gray-500 mt-3">
                                        {new Date(p.createdAt).toLocaleDateString()}
                                    </p>




                                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                navigate("/update/post", { state: { post: p } })
                                            }
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <CiEdit className="text-lg" />
                                            <span>Edit</span>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => dispatch(openDeleteModal(p._id))}
                                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <MdDelete className="text-lg" />
                                            <span>Delete</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="text-gray-400 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">No posts yet</h3>
                        <p className="mt-2 text-gray-600">
                            Share your first update with your campus community!
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/create/post")}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Create Your First Post
                        </motion.button>
                    </motion.div>
                )}


                {showDeleteModal && <DeleteModal />}
            </div>
        </div>
    )
}

export default PostManage

import React from 'react'
import { motion } from 'framer-motion'

import { FaRegHeart, FaHeart, FaComment, FaShare } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { liking } from '../features/HomeSlice';
import { socket } from '../services/socket';

const DetailedPost = ({ post, comments }) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    // console.log(user)
    const handleLike = () => {

        dispatch(liking(post._id))
        if (user && post) {
            socket.emit("sendNotification", {
                receiver: post?.creator?._id,
                message: `❤️ ${user?.name} liked your post ${post?.content}`,
                senderid: user?.id,
            })
        }



    }



    const isLiked = post?.likes.some((like) => like.user?.toString() === user.id?.toString())

    return (
        <motion.div

            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >

            <div className="p-4 pb-3 flex items-center gap-3">
                <div className="relative">
                    <img
                        src={post?.creator?.image || "/default-avatar.png"}
                        alt={post?.creator?.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{post?.creator?.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        {post?.creator?.institute} •{" "}
                        {new Date(post?.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>


            <div className="px-4 pb-3">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {post?.content}
                </p>
            </div>


            {post?.cover && (
                <div className="px-4 pb-3">
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                        <img
                            src={post.cover}
                            alt="Post content"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}


            <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>{post?.likes?.length || 0} likes</span>
                    <span>{comments?.length || 0} comments</span>
                </div>

                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isLiked
                            ? "text-red-600 bg-red-50"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {isLiked ? (
                            <FaHeart className="text-red-600" />
                        ) : (
                            <FaRegHeart className="text-gray-600" />
                        )}
                        <span>Like</span>
                    </motion.button>


                </div>
            </div>
        </motion.div>
    )
}

export default DetailedPost



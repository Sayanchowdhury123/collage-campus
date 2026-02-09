import React from 'react'
import { useNavigate } from 'react-router-dom'

const Card = ({ post }) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/post/${post?._id}`)}
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
            
        >
          
            <div className="flex items-center p-4 space-x-3 border-b border-gray-100">
                <img
                    src={post?.creator?.image || "https://via.placeholder.com/40"}
                    alt={`${post?.creator?.name || "User"}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    loading="lazy"
                />
                <div>
                    <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {post?.creator?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                        Posted on: {new Date(post?.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

          
            <div className="p-4">
               
                {post?.cover && (
                    <div className="mb-3 overflow-hidden rounded-lg">
                        <img
                            src={post?.cover}
                            alt={post?.content?.substring(0, 50) || "Post image"}
                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/600x250?text=No+Image")}
                        />
                    </div>
                )}

           
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {post?.content || "No content"}
                </p>
            </div>
        </div>
    )
}

export default Card

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addcomment, deletecom, editcomment } from '../features/HomeSlice'
import toast from 'react-hot-toast'
import { motion } from "framer-motion"
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { formatDistanceToNow } from "date-fns"
import { socket } from '../services/socket'


const Comments = ({ postid, post }) => {
  const { comments } = useSelector((state) => state.home)
  const [text, setText] = useState("")
  const dispatch = useDispatch()
  const [isEdit, setisEdit] = useState(false)
  const [comid, setcomid] = useState(null)
  const { user } = useSelector((state) => state.auth)

  const add = async () => {
    if (text?.trim() !== "") {
      const result = await dispatch(addcomment({ postid, message: text }))

      if (user?.id !== post?.creator?._id) {
        socket.emit("sendNotification", {
          receiver: post?.creator?._id,
          message: `💬 ${user?.name} commented your post ${post?.content}`,
          senderid: user?.id,
        })
      }


      if (addcomment.fulfilled.match(result)) {
        toast.success("comment added")
        setText("")
      } else {
        toast.error("operation failed")
      }
    }

  }

  const del = async (commentid) => {

    const result = await dispatch(deletecom(commentid))
    if (deletecom.fulfilled.match(result)) {
      toast.success("comment deleted")
      setText("")
    } else {
      toast.error("operation failed")
    }


  }


  const edit = async () => {
    if (text?.trim() !== "" && comid) {
      const result = await dispatch(editcomment({ comid, message: text }))
      if (editcomment.fulfilled.match(result)) {
        toast.success("comment edited")
        setText("")
        setcomid(null)
        setisEdit(false)
      } else {
        toast.error("operation failed")
        setcomid(null)
        setisEdit(false)
      }
    }

  }


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments?.length || 0})
        </h3>
      </div>

      <div className="p-5 border-b border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isEdit ? edit : add}
            disabled={!text.trim()}
            className={`px-5 py-2.5 cursor-pointer rounded-lg font-medium transition-colors ${!text.trim()
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
          >
            {isEdit ? "Update" : "Post"}
          </motion.button>
        </div>
      </div>


      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {comments?.length > 0 ? (
          comments.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex gap-3">

                <img
                  src={c?.owner?.image || "/default-avatar.png"}
                  alt={c?.owner?.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />


                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{c?.owner?.name}</h4>
                    <span className="text-xs text-gray-500">
                      • {formatDistanceToNow(new Date(c?.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-gray-800 mb-3 whitespace-pre-wrap">
                    {c?.message}
                  </p>

                  {
                    c?.owner?._id === user.id && (
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setcomid(c._id);
                            setText(c.message);
                            setisEdit(true);
                          }}
                          className="flex cursor-pointer items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <CiEdit />
                          Edit
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => del(c._id)}
                          className="flex cursor-pointer items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <MdDelete />
                          Delete
                        </motion.button>
                      </div>
                    )
                  }

                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-600">No comments yet</p>
            <p className="text-sm text-gray-500 mt-1">Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Comments


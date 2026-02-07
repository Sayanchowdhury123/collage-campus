import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchpost } from '../features/PostSlice'
import Loadingscrenn from '../components/Loadingscrenn'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';

const PostManage = () => {
    const dispatch = useDispatch()
    const { posts, loading, error, pagination } = useSelector((state) => state.post)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchpost())
        }

    }, [dispatch, user?.id])

    if (loading) return <Loadingscrenn />
    
    if (error) {
        toast.error(error)
    }
    return (
        <div>
            <div>
                <p>Your Posts</p>
                {
                    posts?.map((p) => (
                        <div key={p?._id}>
                            <img src={p?.cover} alt="post" />
                            <p>{p?.content}</p>
                            <div>
                                <button><CiEdit />Edit</button>
                                <button><MdDelete />Delete</button>
                            </div>
                        </div>
                    ))
                }

            </div>


        </div>
    )
}

export default PostManage

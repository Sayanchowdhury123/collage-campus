import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoMdClose } from "react-icons/io";
import { setShowsidebar } from '../features/authslice';
import { MdFeed } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { MdGroups } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { GrResources } from "react-icons/gr";
import { TiGroupOutline } from "react-icons/ti";

const Sidebar = () => {
    const { user, showSideBar } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    return (
        <div className="">
            <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={` ${showSideBar ? "block" : "hidden"} bg-[#121e31] h-screen z-50 fixed top-0 right-0 min-w-62.5 py-6 px-4 tracking-wide overflow-auto`}>
                <div className="flex flex-wrap relative items-center gap-4 cursor-pointer">
                    <img
                        src={user?.image}
                        className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <div>
                        <p className="text-sm text-white">{user?.name || "john doe"}</p>
                        <p className="text-xs text-gray-300 mt-0.5">{user?.email}</p>
                    </div>
                    <IoMdClose className='absolute right-0 bottom-8 text-2xl text-white' onClick={() => dispatch(setShowsidebar())} />
                </div>
                <hr className="my-6 border-gray-400" />
                <ul className="space-y-3">
                    <li onClick={(e) => {
                        e.preventDefault()
                        navigate("/user/post")
                        dispatch(setShowsidebar())
                    }}

                    >
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal flex justify-start gap-2 items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                            <MdFeed className='text-2xl ' />
                            <span>Your Posts</span>
                        </a>
                    </li>
                    <li onClick={(e) => {
                        e.preventDefault()
                        navigate("/create/post")
                        dispatch(setShowsidebar())
                    }}>
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal flex justify-start gap-2 items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                            <IoIosCreate className='text-2xl ' />
                            <span>Create Post</span>
                        </a>
                    </li>
                    <li onClick={(e) => {
                        e.preventDefault()
                        navigate("/groups")
                        dispatch(setShowsidebar())
                    }}>
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal flex justify-start gap-2 items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                            <FaUserGroup className='text-2xl ' />
                            <span>Manage Groups</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal flex items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                className="w-4.5 h-4.5 mr-3"
                                viewBox="0 0 511.414 511.414"
                            >
                                <path
                                    d="M497.695 108.838a16.002 16.002 0 0 0-9.92-14.8L261.787 1.2a16.003 16.003 0 0 0-12.16 0L23.639 94.038a16 16 0 0 0-9.92 14.8v293.738a16 16 0 0 0 9.92 14.8l225.988 92.838a15.947 15.947 0 0 0 12.14-.001c.193-.064-8.363 3.445 226.008-92.837a16 16 0 0 0 9.92-14.8zm-241.988 76.886-83.268-34.207L352.39 73.016l88.837 36.495zm-209.988-51.67 71.841 29.513v83.264c0 8.836 7.164 16 16 16s16-7.164 16-16v-70.118l90.147 37.033v257.797L45.719 391.851zM255.707 33.297l55.466 22.786-179.951 78.501-61.035-25.074zm16 180.449 193.988-79.692v257.797l-193.988 79.692z"
                                    data-original="#000000"
                                />
                            </svg>
                            <span>Product</span>
                        </a>
                    </li>
                    <li onClick={(e) => {
                        e.preventDefault()
                        navigate("/groups")
                        dispatch(setShowsidebar())
                    }}>
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal flex justify-start gap-2 items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                           <TiGroupOutline className='text-2xl'/>
                            <span>Your Groups</span>
                        </a>
                    </li>
                    <li onClick={(e) => {
                        e.preventDefault()
                        navigate("/all/groups")
                        dispatch(setShowsidebar())
                    }}>
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal flex justify-start gap-2 items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                            <MdGroups className='text-2xl' />
                            <span>All Groups</span>
                        </a>
                    </li>
                    <li onClick={(e) => {
                        e.preventDefault()
                        navigate(`/profile/${user.id}`)
                        dispatch(setShowsidebar())
                    }}>
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal  flex gap-2 justify-start items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                            <CgProfile className='text-2xl' />
                            <span>Profile</span>
                        </a>
                    </li>


                    <li onClick={(e) => {
                        e.preventDefault()
                        navigate("/resource/all")
                        dispatch(setShowsidebar())
                    }}>
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal  flex gap-2 justify-start items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                            <GrResources className='text-2xl' />
                            <span>Resources</span>
                        </a>
                    </li>
                </ul>
            </motion.nav>

        </div>
    )
}

export default Sidebar

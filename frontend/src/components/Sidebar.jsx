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
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

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
                    <li onClick={(e) => {
                        e.preventDefault()
                        navigate("/notifications")
                        dispatch(setShowsidebar())
                    }}>
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal flex justify-start gap-2 items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                            <FaBell className='text-2xl'/>
                            <span>Notifications</span>
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
                            <span>Manage Groups</span>
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

                      <li onClick={(e) => {
                        e.preventDefault()
                        navigate("/user/resources")
                        dispatch(setShowsidebar())
                    }}>
                        <a
                            href="javascript:void(0)"
                            className="text-white text-[15px] font-normal  flex gap-2 justify-start items-center hover:bg-gray-700 rounded px-4 py-2 transition-all"
                        >
                            <GrResources className='text-2xl' />
                            <span> Manage Resources</span>
                        </a>
                    </li>
                </ul>
            </motion.nav>

        </div>
    )
}

export default Sidebar

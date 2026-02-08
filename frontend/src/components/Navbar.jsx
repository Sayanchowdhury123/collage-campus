import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const {user} = useSelector((state) => state.auth)
   
    const navigate = useNavigate()
    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm flex justify-between items-center px-5" >
                <div className="" onClick={(e) => {
                   e.preventDefault()
                   navigate("/home")
                }}>
                    <a className="btn btn-ghost text-xl">Campus Connect</a>
                </div>
                <div className="flex gap-2">
                    
                    <div className="dropdown dropdown-end">
                        <div  role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src={user ? user.image : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar

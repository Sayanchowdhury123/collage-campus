import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../features/authslice'
const Home = () => {
  
  const dispatch = useDispatch()
     
  const handlelogout = () => {
    dispatch(logout())
  }

  return (
    <div>
      <p>home</p>
      <button onClick={handlelogout}>logout</button>
      
    </div>
  )
}

export default Home

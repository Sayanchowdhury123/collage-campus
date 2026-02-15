import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterForm from './components/RegisterForm'
import { Toaster } from 'react-hot-toast'
import LoginForm from './components/LoginForm'
import Verifyemail from './components/Verifyemail'
import Home from './pages/Home'
import PrivateRoute from './components/Protected'
import ProfilePage from './pages/Profile'
import Updateprofile from './pages/Updateprofile'
import Emailsent from './components/Emailsent'
import Formfill from './components/Formfill'
import CreatePost from './pages/CreatePost'
import PostManage from './pages/PostManage'
import UpdateModel from './components/UpdateModel'
import Navbar from './components/Navbar'
import Detailed from './pages/Deatiled'
import Groups from './pages/Groups'
import Creategroup from './components/CreateGroup'
import ExploreGrp from './pages/ExploreGrp'
import GroupDetails from './pages/GroupDetails'
import GroupCreatePost from './components/GroupCreatePost'
import Sidebar from './components/Sidebar'
import ResourceUpload from './components/CreateResource'
import YourResource from './pages/YourResource'


function App() {


  return (
    <div className='relative'>
      <BrowserRouter>
        <Toaster />
        <Navbar />
        <Sidebar />
        <Routes>

          <Route path='/register' element={<RegisterForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/verify' element={<Verifyemail />} />
          <Route path='/email/sent' element={<Emailsent />} />
          <Route path='/form/fill' element={<Formfill />} />

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/update/profile' element={<Updateprofile />} />
            <Route path='/create/post' element={<CreatePost />} />
            <Route path='/user/post' element={<PostManage />} />
            <Route path='/update/post' element={<UpdateModel />} />
            <Route path='/post/:postid' element={<Detailed />} />
            <Route path='/groups' element={<Groups />} />
            <Route path='/add/group' element={<Creategroup />} />
            <Route path='/all/groups' element={<ExploreGrp />} />
            <Route path='/group/:gid' element={<GroupDetails />} />
            <Route path='/add/post/:gid' element={<GroupCreatePost />} />
            <Route path='/resource/add' element={<ResourceUpload/>} />
            <Route path='/resources' element={<YourResource/>} />
          </Route>


        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

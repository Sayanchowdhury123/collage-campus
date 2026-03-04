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
import ResourceList from './pages/Resources'
import ResourceDetails from './pages/ResourceDetails'
import PublicLayout from './components/PublicLayout'
import PrivateLayout from './components/PrivateLayout'
import Notifcations from './pages/Notifcations'
import YourGroups from './pages/YourGroups'


function App() {


  return (
    <div className=''>
      <BrowserRouter>
        <Toaster />

        <Routes>

          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/verify" element={<Verifyemail />} />
          <Route path="/email/sent" element={<Emailsent />} />
          <Route path="/form/fill" element={<Formfill />} />


          <Route element={
            <PrivateRoute />
          }>
            
              <Route path="/home" element={<PrivateLayout><Home /></PrivateLayout>} />
              <Route path='/profile/:id' element={<PrivateLayout><ProfilePage /></PrivateLayout>} />
              <Route path='/update/profile' element={<PrivateLayout><Updateprofile /></PrivateLayout>} />
              <Route path='/create/post' element={<PrivateLayout><CreatePost /></PrivateLayout>} />
              <Route path='/user/post' element={<PrivateLayout><PostManage /></PrivateLayout>} />
              <Route path='/update/post' element={<PrivateLayout><UpdateModel /></PrivateLayout>} />
              <Route path='/post/:postid' element={<PrivateLayout><Detailed /></PrivateLayout>} />
              <Route path='/groups' element={<PrivateLayout><Groups /></PrivateLayout> }/>
              <Route path='/add/group' element={<PrivateLayout><Creategroup /></PrivateLayout>} />
              <Route path='/all/groups' element={<PrivateLayout><ExploreGrp /></PrivateLayout>} />
              <Route path='/group/:gid' element={<PrivateLayout><GroupDetails /></PrivateLayout>} />
              <Route path='/add/post/:gid' element={<PrivateLayout><GroupCreatePost /></PrivateLayout>} />
              <Route path='/resource/add' element={<PrivateLayout><ResourceUpload /></PrivateLayout>} />
              <Route path='/resources' element={<PrivateLayout><YourResource /></PrivateLayout>} />
              <Route path='/resource/all' element={<PrivateLayout><ResourceList /></PrivateLayout>} />
              <Route path='/resource/details/:resourceid' element={<PrivateLayout><ResourceDetails /></PrivateLayout>} />
              <Route path='/user/resources' element={<PrivateLayout><YourResource /></PrivateLayout>} />
              <Route path='/notifications' element={<PrivateLayout><Notifcations/></PrivateLayout>} />
              <Route path='/user/groups' element={<PrivateLayout><YourGroups/></PrivateLayout>}  />
            </Route>


          


        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

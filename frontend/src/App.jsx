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

function App() {


  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>

          <Route path='/register' element={<RegisterForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/verify' element={<Verifyemail />} />
          <Route path='/email/sent' element={<Emailsent/>} />
          <Route path='/form/fill' element={<Formfill/>} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/update/profile' element={<Updateprofile/>} />

          </Route>


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

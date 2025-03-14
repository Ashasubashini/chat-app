import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLoaderData, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Setting from './pages/Setting';
import Profile from './pages/profile';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import {Loader} from 'lucide-react';
import {Toaster} from 'react-hot-toast';

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  console.log({onlineUsers});

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  console.log({authUser});

  if (isCheckingAuth && !authUser) return (
    <div className='flex justify-center items-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>

  )


  return (
    <div >
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser ?<Login /> : <Navigate to="/"/>} />
        <Route path="/signUp" element={!authUser ? <SignUp /> :  <Navigate to="/"/>} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/profile" element={authUser ? <Profile />: <Navigate to="/login"/>} />
      </Routes>

      <Toaster/>
    </div>
  );
};

export default App;

import React, { useContext } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Error from './pages/Error'
import { AuthContext } from './context/AuthContext';

function App() {

  const { currentUser } = useContext(AuthContext)
  console.log(currentUser);
  const ProtectedRoute=({ children })=>{
    if(!currentUser){
      return (
        <Navigate to='/login'/>
      )
    }
    return children
  }

  return (
    <div className='h-screen w-full'>
      <Router>
        <Routes>
          <Route path='/'>
            <Route index element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }/>
            <Route path='login' element={<Login/>}/>
            <Route path='register' element={<Register/>}/>
            <Route path='*' element={<Error/>}/>
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App

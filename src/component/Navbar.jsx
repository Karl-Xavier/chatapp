import React, { useContext } from 'react'
import './compStyles/Navbar.css'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase.config'
import { AuthContext } from '../context/AuthContext'
import Logo from '../assets/logo.jpg'

const Navbar = () => {

  const { currentUser } = useContext(AuthContext)

  const handleSignOut=()=>{
    signOut(auth)
  }

  return (
    <div className='navDiv'>
      <div className="container navdivider">
        <a href="">
          <img src={Logo} className='logol' />
          <h1 className='font-bold'>ChatterBox</h1>
        </a>
        <div className="action">
          <div>
            <img src={currentUser.photoURL} alt={currentUser.displayName}/>
            <span className='userName hidden md:hidden lg:block'>{currentUser.displayName}</span>
          </div>
          <button onClick={handleSignOut} className='btn baton'>Sign Out</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
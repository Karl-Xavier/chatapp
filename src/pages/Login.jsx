import React from 'react'
import './styles/Login.css'
import  TextField  from '@mui/material/TextField'
import 'bootstrap/dist/css/bootstrap.css'
import { Google } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, db } from '../config/firebase.config'
import { doc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'

const Login = () => {

  const navigate = useNavigate()

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const email = e.target['email'].value
    const password = e.target['password'].value
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (error) {
      console.log(error.message)
      toast.error('Something went wrong', {position: 'top-center'})
    }
  }

  const googleUser=async()=>{
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      const displayName = user.displayName || 'Anonymous';
      const photoURL = user.photoURL || avatar;

      await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName,
          email: user.email,
          photoURL
      });

      await setDoc(doc(db, 'userChats', user.uid), {});
      navigate('/')
  } catch (error) {
      console.error('Error signing up with Google:', error.message);
  }
  }

  return (
    <div className=' mani h-screen max-w-full flex justify-center items-center'>
        <div className="container flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit}>
            <h1 className='text-3xl'>Login to your account</h1>
            <span>ChatterBox</span>
            <TextField
                label="Email"
                className='input'
                type='email'
                name='email'
                required
            />
            <TextField
                label="Password"
                className='input'
                type='password'
                name='password'
                required
            />
            <button className='btn w-52 sm:w-full mt-2' type='submit'>Login</button>
            <div className="divider">
            <span>OR</span>
            </div>
            <button onClick={googleUser} type='button' className='btn w-52 sm:w-full mt-3'>Login In with <Google style={{ color: '#fff'}} /> </button>
            <p>Don't have an acount? <Link to="/register">Sign in</Link></p>
        </form>
        
        </div>
    </div>
  )
}

export default Login
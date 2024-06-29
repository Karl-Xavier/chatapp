import React from 'react'
import './styles/Register.css'
import 'bootstrap/dist/css/bootstrap.css'
import  TextField  from '@mui/material/TextField'
import {Google } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/avatar.png'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../config/firebase.config'
import { doc, setDoc } from 'firebase/firestore'

const Register = () => {
    const navigate = useNavigate()

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const displayName = e.target['uname'].value
        const email = e.target['email'].value
        const password = e.target['password'].value
        const file = e.target['avatar'].files[0]
        
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, displayName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                (error)=>{
                    console.log(error.message)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then(async(downloadURL)=>{
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL
                        })
                       await setDoc(doc(db, 'users', res.user.uid), {
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL
                       })
                       await setDoc(doc(db, 'userChats', res.user.uid), {})
                       navigate('/')
                    })
                }
            )
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    const signUpGoogle = async () => {
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
        <div className="container w-full flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit}>
                <h1 className='text-3xl'>Create a new account</h1>
                <span>ChatterBox</span>
                <TextField
                    label="Username"
                    className='input'
                    type='text'
                    name='uname'
                    required
                />
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
                <input
                    type='file'
                    style={{display: 'none'}}
                    id='avatar'
                    name='avatar'
                    required
                />
                <label htmlFor="avatar" className="avata">
                    <img src={avatar} alt="" height={40} width={40}/>
                    Add Profile Picture
                </label>
                <button className='btn w-52 sm:w-full mt-2' type='submit'>Sign up</button>
                <div className="divider">
                <span>OR</span>
                </div>
                <button onClick={signUpGoogle} type='button' className='btn w-52 sm:w-full mt-3'>Sign up with <Google style={{ color: '#fff'}} /> </button>
                <p>Already have an acount <Link to="/login">Login</Link></p>
            </form>
        
        </div>
    </div>
  )
}

export default Register
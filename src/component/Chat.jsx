import React, { useContext, useEffect, useState } from 'react'
import './compStyles/Chat.css'
import { AuthContext } from '../context/AuthContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase.config'
import { ChatContext } from '../context/ChatContext'

const Chat = ({ toggle }) => {
  const [chats, setChats] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)
  useEffect(()=>{
    const getChat=()=>{
      const unSub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc)=>{
        setChats(doc.data())
      })
      return ()=> unSub()
    }

    currentUser.uid && getChat()
  }, [currentUser])

  //Object.entries()
  if(chats.length === 0){
    return(
      <div className='h-52 flex flex-col justify-center items-center'>
        <h3 className='font-extrabold'>No Messages Yet</h3>
      </div>
    )
  }
  const handleSelect=(u)=>{
    dispatch({type:"CHANGE_USER", payload: u})
  }

  return (
    <div className='container p-2 overflow-scroll overflow-x-hidden chat'>
      {Object.entries(chats)?.sort((a,b)=> b[1].date - a[1].date).map(chat=>{
        return(
          <div className="user" onClick={()=> {
            toggle()
            handleSelect(chat[1].userInfo)
            }} key={chat[0]}>
            <img src={chat[1].userInfo.photoURL} alt="avatar"/>
            <div className="message">
              <p className='useName'>{chat[1].userInfo.displayName}</p>
              <span>{chat[1].lastMessage?.text}</span>
            </div>
          </div>
        )
      })}
    </div> 
  )
}

export default Chat
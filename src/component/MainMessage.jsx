import React, { useContext, useState, useEffect } from 'react'
import './compStyles/MainMessage.css'
import Message from './Message'
import { ChatContext } from '../context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase.config'
import { ChatCenteredDots } from 'phosphor-react'

const MainMessage = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)

  useEffect(()=>{
    const unSub = onSnapshot(doc(db, 'chat', data.chatId), (doc)=>{
      doc.exists() && setMessages(doc.data().messages)
    })
    return ()=> unSub()
  },[data.chatId])

  if(messages.length === 0){
    return(
      <div className='h-full flex flex-col justify-center items-center'>
        <h3 className='font-extrabold'>No Messages Yet</h3>
        <ChatCenteredDots weight='fill' color={'#01070e'} size={35}/>
      </div>
    )
  }

  return (
    <div className='overflow-scroll overflow-x-hidden mainmess'>
      {messages.map(m=>{
        return(
          <Message
            message={m}
            key={m.id}
          />
        )
      })}
    </div>
  )
}

export default MainMessage
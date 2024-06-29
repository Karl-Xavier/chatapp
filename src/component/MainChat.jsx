import React, { useContext } from 'react'
import './compStyles/MainChat.css'
import 'bootstrap/dist/css/bootstrap.css'
import MainMessage from './MainMessage'
import MsgInput from './MsgInput'
import { ArrowLeft } from 'phosphor-react'
import { ChatContext } from '../context/ChatContext'

const MainChat = ({ toggleVisible, isVisible }) => {

  const {data} = useContext(ChatContext)

  const classes = isVisible ? 'col-lg-8 p-0 main relative' : 'col-lg-8 p-0 hidden md:hidden relative lg:block main'

  return (
    <div className={classes}>
      <div className="navigation">
        <span onClick={toggleVisible} className='lg:hidden'><ArrowLeft size={25}/></span>
        <h3 className='ml-2 head'>{data.user.displayName}</h3>
      </div>
        <MainMessage/>
        <MsgInput/>
    </div>
  )
}

export default MainChat
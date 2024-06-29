import React, { useState } from 'react'
import './styles/Home.css'
import 'bootstrap/dist/css/bootstrap.css'
import SideNav from '../component/SideNav'
import MainChat from '../component/MainChat'

const Home = () => {

  const [isLargeColumnVisible, setIsLargeColumnVisible] = useState(false)

  const ToggleColumnVisibility = () => {
    setIsLargeColumnVisible(!isLargeColumnVisible)
  }

  return (
    <div className='container p-0 homeCon h-screen w-full flex justify-center items-center'>
      <div className="row w-full">
        <SideNav
          toggleVisible={ToggleColumnVisibility}
          isVisible={!isLargeColumnVisible}
        />
        <MainChat
          toggleVisible={ToggleColumnVisibility}
          isVisible={isLargeColumnVisible}
        />
      </div>
    </div>
  )
}

export default Home
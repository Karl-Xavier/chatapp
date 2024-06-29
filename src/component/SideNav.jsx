import React from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chat from './Chat'
import 'bootstrap/dist/css/bootstrap.css'

const SideNav = ({ toggleVisible, isVisible }) => {

  const classes = isVisible ? "col-lg-4 border-l-white p-0" : "col-lg-4 border-l-white p-0 hidden lg:block"

  return (
    <div className={classes}>
        <Navbar/>
        <Search/>
        <Chat
          toggle={toggleVisible}
          isVisible={isVisible}
        />
    </div>
  )
}

export default SideNav
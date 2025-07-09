import React from 'react';
import SidebarOptions from './SidebarOptions';
import '../css/Sidebar.css';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className='sidebar'>
      <SidebarOptions />
      <div className='sidebar_bottom'>
        <a>About</a>
        <a>Terms</a>
        <a>Privacy</a>
        <a>Acceptable Use</a>
        <a>Advertise</a>
        <a>Press</a>
      </div>
    </div>
  )
}

export default Sidebar

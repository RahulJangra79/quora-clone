import React from 'react';
import SidebarOptions from './SidebarOptions';
import '../css/Sidebar.css';

function Sidebar() {
  return (
    <div className='sidebar'>
      <SidebarOptions />
      <div className='sidebar_bottom'>
        <a href='#'>About</a>
        <a href='#'>Terms</a>
        <a href='#'>Privacy</a>
        <a href='#'>Acceptable Use</a>
        <a href='#'>Advertise</a>
        <a href='#'>Press</a>
      </div>
    </div>
  )
}

export default Sidebar

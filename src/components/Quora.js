import React from 'react'
import "../css/Quora.css";
import Sidebar from './Sidebar';
import Feed from './Feed';
import Widget from './Widget';

function Quora() {
  return (
    <div className='quora'>
      <div className='quora-content'>
        <Sidebar />
        <Feed />
        <Widget />
      </div>
    </div>
  )
}

export default Quora

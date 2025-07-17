import { useState } from 'react'
import "../css/Answer.css";
import AnsSidebar from './AnsSidebar';
import AnsFeed from './AnsFeed';
import AnsWidget from './AnsWidget';

function Answer() {
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <div className='answer'>
      <div className='answer-content'>
        <AnsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <AnsFeed activeTab={activeTab} />
        <AnsWidget />
      </div>
    </div>
  )
}

export default Answer;

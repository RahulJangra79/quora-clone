import React from "react";
import "../css/WidgetContent.css";
import image from '../images/science.jpeg';

function WidgetContent() {
  return (
    <div className="widget__contents">
      <div className="widget__content">
        <img
          src={image}
          alt=""
        />
        <div className="widget__contentTitle">
          <h5>Mobile App Programmer</h5>
          <p>The best Mobile App Development Company</p>
        </div>
      </div>
      <div className="widget__content">
        <img
          src={image}
          alt=""
        />
        <div className="widget__contentTitle">
          <h5>Quota of Quotes</h5>
          <p>Daily dosage of unforgettable lines from ...</p>
        </div>
      </div>
      <div className="widget__content">
        <img
          src={image}
          alt=""
        />
        <div className="widget__contentTitle">
          <h5>Art & Artist</h5>
          <p>A Space retated to creating, practicing an...</p>
        </div>
      </div>
      <div className="widget__content">
        <img
          src={image}
          alt=""
        />
        <div className="widget__contentTitle">
          <h5>Friedrich Nietzche</h5>
          <p>A Space dedicated to great work of Friedrich...</p>
        </div>
      </div>
      <div className="widget__content">
        <img
          src={image}
          alt=""
        />
        <div className="widget__contentTitle">
          <h5>Stock Market Strategies</h5>
          <p>Everything about investing in Stock...</p>
        </div>
      </div>
      <div className="widget__content">
        <img
          src={image}
          alt=""
        />
        <div className="widget__contentTitle">
          <h5>Architecture World</h5>
          <p>All about civil architecture...</p>
        </div>
      </div>
    </div>
  );
}

export default WidgetContent;
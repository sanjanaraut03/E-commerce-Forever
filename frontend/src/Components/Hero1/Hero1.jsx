import React from 'react'
import './Hero1.css';
import hand_icon from '../Assets/hand_icon.png';
import arrow_icon from '../Assets/arrow.png'
import hero_img from '../Assets/hero_image.png';

export const Hero1 = () => {
  return (
<div className='hero'>
    <div className="hero-left">
       <h2>NEW ARRIVALS ONLY </h2>
        <div>
         <div className="hero-hand-icon">
           <p>New</p>
           <img src={hand_icon} alt="" />
         </div>
            <p>Collections</p>
            <p>For Everyone </p>
        </div>
        <div className="hero-latest-btn">
        <div>Latest Collection</div>
        <img src={arrow_icon}></img>
        </div>
    </div>
    <div className="hero-right">
        <img src={hero_img} alt="" srcset="" />
    </div>
</div>
  )
}

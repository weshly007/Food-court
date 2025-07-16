import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <h1 className='title'>Food Court</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil repellendus laboriosam quod, possimus deserunt aut at, ea, officiis reprehenderit sit harum accusamus recusandae laborum omnis illum autem quia in hic.</p>
                <div className="footer-Social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>Company</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privay policy</li>
                </ul>
                
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91-7386----84</li>
                    <li>foodcourt@gmail.com</li>
                </ul>
            </div>
            
        </div>
        <hr/>
        <p className="footer-copyright">CopyRight 2024 © foodcourt.com - All Right Reserved</p>
    </div>
  )
}

export default Footer

import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';

const Navbar = ({ onLogout }) => {
  return (
    <div className='navbar'>
      <h1 className='title'>Food Court Admin panel</h1>
      
      <div className="navbar-right">
        <img className='profile' src={assets.profile_icon} alt="Profile" />
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;

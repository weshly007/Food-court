import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axios from "axios";

const LoginPopup = ({ onLoginSuccess }) => {
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const url = "https://backend-o51h.onrender.com";

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${url}/api/user/login`, data);

      if (response.data.success) {
        const role = response.data.role;
        if (role === "admin") {
          onLoginSuccess(response.data.token);
        } else {
          alert("You are not an admin.");
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className='login-popup-title'>
          <h2>Admin Login</h2>
        </div>
        <div className="login-popup-inputs">
          <input
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder='Enter your Email'
            required
          />
          <input
            name='password'
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder='Enter your Password'
            required
          />
        </div>
        <button type='submit'>Login</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;

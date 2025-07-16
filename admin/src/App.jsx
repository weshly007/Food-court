import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPopup from './components/LoginPopup/LoginPopup';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState('');
  const url = "https://backend-o51h.onrender.com";

  useEffect(() => {
    const storedToken = localStorage.getItem("admin-token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("admin-token", newToken);
    setToken(newToken);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setToken('');
    setShowLogin(true);
  };

  return (
    <div>
      <ToastContainer />
      {showLogin ? (
        <LoginPopup setShowLogin={setShowLogin} onLoginSuccess={handleLoginSuccess} isAdmin={true} />
      ) : (
        <>
          <Navbar onLogout={handleLogout} />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

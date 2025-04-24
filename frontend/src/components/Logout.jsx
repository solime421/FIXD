import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Logout({ className, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();            // clear auth token & user
    navigate('/login');  // send them back to login
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}
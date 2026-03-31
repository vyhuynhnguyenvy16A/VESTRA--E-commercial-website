import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx'; 

const GuestRoute = ({ children }) => {
  const { user } = useAuth(); 

  if (user) {
    return <Navigate to="/role-redirect" replace />;
  }

  return children;
};

export default GuestRoute;
import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  } else {
    return false;
  }
};

const PrivateRoute = (props) => {
  const isAuth = useAuth();
  return <>{isAuth ? <Outlet /> : <Navigate to='/' />}</>;
};

export default PrivateRoute;

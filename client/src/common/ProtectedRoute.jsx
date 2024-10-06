import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { UserContext } from '../common/UserContext';

const ProtectedRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useContext(UserContext);

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/signin" />}
    />
  );
};

export default ProtectedRoute;

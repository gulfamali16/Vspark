import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const isAdmin = sessionStorage.getItem('vspark_admin');
  return isAdmin ? children : <Navigate to="/admin/login" />;
}

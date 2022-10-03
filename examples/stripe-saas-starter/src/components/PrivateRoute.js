import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
export function PrivateRoute({ children }) {
  const { session } = useAuth();
  let location = useLocation();
  return session ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

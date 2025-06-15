import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAppSelector } from '../../services/store';
import { getIsAuth } from '../../services/slice/authSlice';

type ProtectedRouteProps = {
  forAuthorized?: boolean;
  onlyUnAuth?: boolean;
  children: ReactNode;
};

export const ProtectedRoute = ({
  forAuthorized = false,
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const from = location.state?.from || '/';
  const isAuthorized = useAppSelector(getIsAuth);

  if (onlyUnAuth && isAuthorized) {
    return <Navigate to={from} replace />;
  }

  if (forAuthorized && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

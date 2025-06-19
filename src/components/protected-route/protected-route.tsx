import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAppSelector } from '../../services/store';
import {
  getIsAuth,
  getIsCheckUser,
  getUser
} from '../../services/slice/authSlice';
import { Preloader } from '@ui';

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
  const user = useAppSelector(getUser);
  const isCheckUser = useAppSelector(getIsCheckUser);

  if (!isCheckUser) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={from} replace />;
  }

  if (onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

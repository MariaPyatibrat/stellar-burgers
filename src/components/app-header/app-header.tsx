import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import { getUser } from '../../services/slice/authSlice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useAppSelector(getUser);
  return <AppHeaderUI userName={user?.name || ''} />;
};

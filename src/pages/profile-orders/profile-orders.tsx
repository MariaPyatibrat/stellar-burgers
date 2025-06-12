import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useAppSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders = useAppSelector((state) => state.feed.orders);

  return <ProfileOrdersUI orders={orders} />;
};

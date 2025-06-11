import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getFeeds, selectFeeds } from '../../services/slice/feedSlice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday, isLoading } = useAppSelector(selectFeeds);

  useEffect(() => {
    dispatch(getFeeds()).then(() => {
      console.log('Orders:', orders);
    });
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

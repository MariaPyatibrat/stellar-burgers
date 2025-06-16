import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/slice/ingredientsSlice';
import { getFeeds, selectFeeds } from '../../services/slice/feedSlice';
import { useParams, useLocation } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const { number } = useParams();
  const location = useLocation();
  const { orders } = useAppSelector(selectFeeds);
  const ingredients = useAppSelector(selectIngredients);

  const order = useMemo(() => {
    if (!number) return null;
    return orders.find((order) => order.number === Number(number));
  }, [number, orders]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients || ingredients.length === 0) return null;

    const date = new Date(order.createdAt);

    interface IIngredientsWithCount {
      [key: string]: TIngredient & { count: number };
    }

    const ingredientsInfo = order.ingredients.reduce<IIngredientsWithCount>(
      (acc: IIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {} as IIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [order, ingredients]);

  if (!orderInfo || ingredients.length === 0) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

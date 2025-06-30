import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { selectIngredients } from '../../services/slice/ingredientsSlice';
import { selectFeeds } from '../../services/slice/feedSlice';
import { useParams, useLocation } from 'react-router-dom';
import { getOrderById, selectOrder } from '../../services/slice/orderSlice';

interface OrderInfoProps {
  source: 'feed' | 'userOrders';
}

export const OrderInfo: FC<OrderInfoProps> = ({ source }) => {
  const { number } = useParams();
  const location = useLocation();
  const { orders, userOrders } = useAppSelector(selectFeeds);
  const { order } = useAppSelector(selectOrder);
  const ingredients = useAppSelector(selectIngredients);
  const dispatch = useAppDispatch();

  let orderDataFromOrdersList = useMemo(() => {
    if (!number) return null;
    if (source === 'feed') {
      return orders.find((order) => order.number === Number(number));
    } else {
      return userOrders.find((order) => order.number === Number(number));
    }
  }, [number, orders, userOrders]);

  useEffect(() => {
    if (!orderDataFromOrdersList) {
      dispatch(getOrderById(Number(number)));
    }
  }, [dispatch, number]);

  const orderDataById = useMemo(() => order, [order]);

  let orderData = orderDataFromOrdersList || orderDataById;
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients || ingredients.length === 0) return null;

    const date = new Date(orderData.createdAt);

    interface IIngredientsWithCount {
      [key: string]: TIngredient & { count: number };
    }

    const ingredientsInfo = orderData.ingredients.reduce<IIngredientsWithCount>(
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
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || !ingredients || ingredients.length === 0) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

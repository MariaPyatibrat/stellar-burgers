import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/slice/ingredientsSlice';
import { selectOrder } from '../../services/slice/orderSlice';

export const OrderInfo: FC = () => {
  const { order } = useAppSelector(selectOrder);
  const ingredients = useAppSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    interface IIngredientsWithCount {
      [key: string]: TIngredient & { count: number };
    }

    const ingredientsInfo = order.ingredients.reduce<IIngredientsWithCount>(
      (acc, item) => {
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
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

import { FC, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  clearConstructor
} from '../../services/slice/constructorSlice';
import {
  createOrderThunk,
  selectOrder,
  clearOrder
} from '../../services/slice/orderSlice';
import { TConstructorIngredient } from '../../services/slice/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const { bun, ingredients = [] } = useAppSelector(selectConstructorItems); // Добавляем значение по умолчанию
  const { order, isLoading } = useAppSelector(selectOrder);

  const onOrderClick = () => {
    if (!bun) return;

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((ing) => ing._id),
      bun._id
    ];

    dispatch(createOrderThunk(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isLoading}
      constructorItems={{ bun, ingredients }}
      orderModalData={order}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

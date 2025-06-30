import { FC, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  selectBurgerConstructorItems,
  clearConstructor
} from '../../services/slice/burgerConstructorSlice';
import {
  createOrderThunk,
  selectOrder,
  clearOrder
} from '../../services/slice/orderSlice';
import { TConstructorIngredient } from '../../services/slice/burgerConstructorSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { getIsAuth } from '../../services/slice/authSlice';
import { getFeeds } from '../../services/slice/feedSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { bun, ingredients = [] } = useAppSelector(
    selectBurgerConstructorItems
  );
  const { order, isLoading } = useAppSelector(selectOrder);
  const isAuth = useAppSelector(getIsAuth);

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!bun) return;

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((ing: TConstructorIngredient) => ing._id),
      bun._id
    ];

    dispatch(createOrderThunk(ingredientsIds))
      .unwrap()
      .then(() => {
        dispatch(getFeeds());
      })
      .catch((error) => {
        console.error('Ошибка при оформлении заказа:', error);
      });
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

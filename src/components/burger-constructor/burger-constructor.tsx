import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData
} from '../../services/slice/constructorSlice';
import { TConstructorIngredient, TOrder } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const { bun, ingredients = [] } = useSelector(selectConstructorItems); // Добавлено значение по умолчанию
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    // Логика создания заказа
  };

  const closeOrderModal = () => {
    // Логика закрытия модального окна
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData as TOrder | null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

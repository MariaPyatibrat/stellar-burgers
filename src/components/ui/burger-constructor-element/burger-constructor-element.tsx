import React, { FC, memo } from 'react';
import styles from './burger-constructor-element.module.css';
import { ConstructorElement } from '@zlden/react-developer-burger-ui-components';
import { BurgerConstructorElementUIProps } from './type';
import { MoveButton } from '@zlden/react-developer-burger-ui-components';

export const BurgerConstructorElementUI: FC<BurgerConstructorElementUIProps> =
  memo(
    ({
      ingredient,
      index,
      totalItems,
      handleMoveUp,
      handleMoveDown,
      handleClose
    }) => {
      const isBun = ingredient.type === 'bun';
      const canMoveUp = !isBun && index > 0;
      const canMoveDown = !isBun && index < totalItems - 1;

      // Создаем пустые функции по умолчанию
      const defaultMoveHandler = () => {};

      return (
        <li
          className={`${styles.element} mb-4 mr-2`}
          data-cy='constructor-ingredient'
        >
          {!isBun && (
            <MoveButton
              handleMoveDown={canMoveDown ? handleMoveDown : defaultMoveHandler}
              handleMoveUp={canMoveUp ? handleMoveUp : defaultMoveHandler}
              isUpDisabled={!canMoveUp}
              isDownDisabled={!canMoveDown}
            />
          )}
          <div
            className={`${styles.element_fullwidth} ${!isBun ? 'ml-2' : ''}`}
          >
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
              handleClose={!isBun ? handleClose : undefined}
            />
          </div>
        </li>
      );
    }
  );

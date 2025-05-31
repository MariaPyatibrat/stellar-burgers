import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slice/ingredientsSlice';
import { burgerConstructorReducer } from './slice/burgerConstructorSlice';
import { orderReducer } from './slice/orderSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: burgerConstructorReducer,
    order: orderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'burgerConstructor.ingredients',
          'burgerConstructor.bun'
        ],
        ignoredActions: [
          'burgerConstructor/addIngredient',
          'burgerConstructor/addBun',
          'burgerConstructor/moveIngredient'
        ]
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

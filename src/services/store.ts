import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slice/ingredientsSlice';
import { burgerConstructorReducer } from './slice/burgerConstructorSlice';
import { orderReducer } from './slice/orderSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { feedReducer } from './slice/feedSlice';
import authReducer from './slice/authSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: burgerConstructorReducer,
    order: orderReducer,
    feed: feedReducer,
    auth: authReducer
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

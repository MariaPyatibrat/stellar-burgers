import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slice/ingredientsSlice';
import { constructorReducer } from './slice/constructorSlice';
import { orderReducer } from './slice/orderSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    constructor: constructorReducer,
    order: orderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['constructor.ingredients', 'constructor.bun'],
        ignoredActions: [
          'constructor/addIngredient',
          'constructor/addBun',
          'constructor/moveIngredient'
        ]
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

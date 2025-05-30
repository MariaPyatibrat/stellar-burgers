import { combineReducers } from 'redux';
import { ingredientsReducer } from './slice/ingredientsSlice';
import { constructorReducer } from './slice/constructorSlice';
import { orderReducer } from './slice/orderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: constructorReducer,
  order: orderReducer
});

export type RootState = ReturnType<typeof rootReducer>;

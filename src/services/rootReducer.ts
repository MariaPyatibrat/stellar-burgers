import { combineReducers } from 'redux';
import { ingredientsReducer } from './slice/ingredientsSlice';
import { burgerConstructorReducer } from './slice/burgerConstructorSlice';
import { orderReducer } from './slice/orderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer
});

export type RootState = ReturnType<typeof rootReducer>;

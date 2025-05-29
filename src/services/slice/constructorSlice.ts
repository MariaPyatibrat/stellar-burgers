import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TOrderModalData = {
  number: number;
  name: string;
  success: boolean;
};

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrderModalData | null;
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const item = state.ingredients[from];
      state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, item);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (
      state,
      action: PayloadAction<TOrderModalData | null>
    ) => {
      state.orderModalData = action.payload;
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  setOrderRequest,
  setOrderModalData
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;

// Селекторы
export const selectConstructorItems = (state: {
  constructor: TConstructorState;
}) => ({
  bun: state.constructor.bun,
  ingredients: state.constructor.ingredients
});

export const selectOrderRequest = (state: { constructor: TConstructorState }) =>
  state.constructor.orderRequest;

export const selectOrderModalData = (state: {
  constructor: TConstructorState;
}) => state.constructor.orderModalData;

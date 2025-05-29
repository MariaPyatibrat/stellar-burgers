import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const { setIngredients, setLoading, setError } =
  ingredientsSlice.actions;

export const ingredientsReducer = ingredientsSlice.reducer;

// Селекторы
export const selectIngredients = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.items;

export const selectBuns = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.items.filter((item) => item.type === 'bun');

export const selectMains = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.items.filter((item) => item.type === 'main');

export const selectSauces = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.items.filter((item) => item.type === 'sauce');

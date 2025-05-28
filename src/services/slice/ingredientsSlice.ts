import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  buns: [],
  mains: [],
  sauces: [],
  isLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (
      state,
      action: PayloadAction<{
        buns: TIngredient[];
        mains: TIngredient[];
        sauces: TIngredient[];
      }>
    ) => {
      state.buns = action.payload.buns;
      state.mains = action.payload.mains;
      state.sauces = action.payload.sauces;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setIngredients, setLoading, setError } =
  ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;

// Селекторы
export const selectBuns = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.buns;
export const selectMains = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.mains;
export const selectSauces = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.sauces;

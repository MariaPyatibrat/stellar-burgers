import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const response = await getIngredientsApi();
    return response.map((item: any) => ({
      _id: item._id,
      name: item.name,
      type: item.type,
      proteins: item.proteins,
      fat: item.fat,
      carbohydrates: item.carbohydrates,
      calories: item.calories,
      price: item.price,
      image: item.image,
      image_large: item.image_large,
      image_mobile: item.image_mobile
    }));
  }
);

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;

// Базовый селектор
const selectIngredientsState = (state: RootState) => state.ingredients;

// Мемоизированные селекторы
export const selectIngredients = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.items
);

export const selectIngredientsLoading = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.isLoading
);

export const selectIngredientsError = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.error
);

export const selectBuns = createSelector([selectIngredients], (items) =>
  items.filter((item) => item.type === 'bun')
);

export const selectMains = createSelector([selectIngredients], (items) =>
  items.filter((item) => item.type === 'main')
);

export const selectSauces = createSelector([selectIngredients], (items) =>
  items.filter((item) => item.type === 'sauce')
);

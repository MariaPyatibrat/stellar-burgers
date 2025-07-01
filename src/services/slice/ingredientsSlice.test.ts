import { createMockRootState } from '../test-utils';
import {
  ingredientsReducer,
  fetchIngredients,
  selectIngredients,
  selectBuns,
  selectMains,
  selectSauces
} from './ingredientsSlice';

const mockBun = {
  _id: '1', name: 'Булка', type: 'bun',
  proteins: 0, fat: 0, carbohydrates: 0, calories: 0,
  price: 100, image: '', image_mobile: '', image_large: ''
};

const mockMain = {
  _id: '2', name: 'Котлета', type: 'main',
  proteins: 10, fat: 5, carbohydrates: 3, calories: 100,
  price: 200, image: '', image_mobile: '', image_large: ''
};

const mockIngredients = [mockBun, mockMain];

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const testFetchStatuses = () => {
    it('should handle pending', () => {
      const state = ingredientsReducer(initialState, { type: fetchIngredients.pending.type });
      expect(state).toEqual({ ...initialState, isLoading: true });
    });

    it('should handle fulfilled', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state).toEqual({
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      });
    });

    it('should handle rejected', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Error' }
      });
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: 'Error'
      });
    });
  };

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
    });

    describe('fetchIngredients', () => {
      testFetchStatuses();
    });
  });

  describe('selectors', () => {
    const mockState = createMockRootState({
      ingredients: {
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      }
    });

    it('should select all ingredients', () => {
      expect(selectIngredients(mockState)).toEqual(mockIngredients);
    });

    it('should select buns', () => {
      expect(selectBuns(mockState)).toEqual([mockBun]);
    });
  });
});

import {
  ingredientsReducer,
  fetchIngredients,
  selectIngredients,
  selectBuns,
  selectMains,
  selectSauces,
  TIngredientsState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 3,
    calories: 100,
    price: 200,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '3',
    name: 'Соус',
    type: 'sauce',
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 50,
    price: 50,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should handle fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: [],
        isLoading: true,
        error: null
      });
    });

    it('should handle fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      });
    });

    it('should handle fetchIngredients.rejected', () => {
      const errorMessage = 'Network Error';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: [],
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('selectors', () => {
    const mockState: RootState = {
      ingredients: {
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      }
      // Добавьте другие части состояния по необходимости
    } as RootState;

    it('should select all ingredients', () => {
      expect(selectIngredients(mockState)).toEqual(mockIngredients);
    });

    it('should select only buns', () => {
      const buns = selectBuns(mockState);
      expect(buns).toHaveLength(1);
      expect(buns[0].type).toBe('bun');
    });

    it('should select only mains', () => {
      const mains = selectMains(mockState);
      expect(mains).toHaveLength(1);
      expect(mains[0].type).toBe('main');
    });

    it('should select only sauces', () => {
      const sauces = selectSauces(mockState);
      expect(sauces).toHaveLength(1);
      expect(sauces[0].type).toBe('sauce');
    });
  });

  describe('async thunk', () => {
    it('fetchIngredients should dispatch correct actions on success', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const extra = {};

      (
        require('../../utils/burger-api').getIngredientsApi as jest.Mock
      ).mockResolvedValue(mockIngredients);

      await fetchIngredients()(dispatch, getState, extra);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: fetchIngredients.pending.type })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        })
      );
    });

    it('fetchIngredients should dispatch correct actions on failure', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const extra = {};
      const errorMessage = 'Network Error';

      (
        require('../../utils/burger-api').getIngredientsApi as jest.Mock
      ).mockRejectedValue(new Error(errorMessage));

      await fetchIngredients()(dispatch, getState, extra);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: fetchIngredients.pending.type })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchIngredients.rejected.type,
          error: expect.objectContaining({ message: errorMessage })
        })
      );
    });
  });
});

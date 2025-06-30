import { burgerConstructorSlice } from './burgerConstructorSlice';

const mockIngredient = {
  _id: '1',
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
};

describe('burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      value: { randomUUID: () => 'test-uuid' }
    });
  });

  const testAddIngredient = () => {
    const state = burgerConstructorSlice.reducer(
        initialState,
        burgerConstructorSlice.actions.addIngredient(mockIngredient)
    );
    expect(state.ingredients).toEqual([{
      ...mockIngredient,
      id: 'test-uuid'
    }]);
  };

  describe('reducers', () => {
    it('should add ingredient', testAddIngredient);

    it('should remove ingredient', () => {
      const state = burgerConstructorSlice.reducer(
          { ...initialState, ingredients: [{ ...mockIngredient, id: '1' }] },
          burgerConstructorSlice.actions.removeIngredient('1')
      );
      expect(state.ingredients).toEqual([]);
    });
  });
});

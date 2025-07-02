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
    it('should return initial state', () => {
      expect(burgerConstructorSlice.reducer(undefined, { type: '' }))
          .toEqual(initialState);
    });

    it('should add ingredient', testAddIngredient);

    it('should remove ingredient', () => {
      const state = burgerConstructorSlice.reducer(
          { ...initialState, ingredients: [{ ...mockIngredient, id: '1' }] },
          burgerConstructorSlice.actions.removeIngredient('1')
      );
      expect(state.ingredients).toEqual([]);
    });

    it('should move ingredient', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: '1' },
          { ...mockIngredient, id: '2' }
        ]
      };

      const state = burgerConstructorSlice.reducer(
          initialStateWithIngredients,
          burgerConstructorSlice.actions.moveIngredient({
            fromIndex: 0,
            toIndex: 1
          })
      );

      expect(state.ingredients.map(i => i.id)).toEqual(['2', '1']);
    });
  });
});

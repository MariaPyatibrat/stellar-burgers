import {
  burgerConstructorSlice,
  TBurgerConstructorState
} from './burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const mockCrypto = {
  randomUUID: jest.fn(
    () => 'mocked-uuid-' + Math.random().toString(36).substring(2, 11)
  )
};

beforeAll(() => {
  // Используем defineProperty для надежного мокирования
  Object.defineProperty(global, 'crypto', {
    value: mockCrypto,
    writable: true,
    configurable: true
  });
});

afterAll(() => {
  delete (global as any).crypto;
});

describe('burgerConstructorSlice reducers', () => {
  const initialState: TBurgerConstructorState = {
    bun: null,
    ingredients: []
  };

  const mockIngredient: TIngredient = {
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

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    mockCrypto.randomUUID.mockClear();
    mockCrypto.randomUUID.mockImplementation(
      () => 'mocked-uuid-' + Math.random().toString(36).substring(2, 11)
    );
  });

  it('should add ingredient with generated uuid', () => {
    // Настраиваем конкретное возвращаемое значение
    mockCrypto.randomUUID.mockReturnValueOnce('test-uuid-123');

    const action = burgerConstructorSlice.actions.addIngredient(mockIngredient);
    const state = burgerConstructorSlice.reducer(initialState, action);

    expect(mockCrypto.randomUUID).toHaveBeenCalledTimes(1);
    expect(state.ingredients).toEqual([
      {
        ...mockIngredient,
        id: 'test-uuid-123'
      }
    ]);
  });

  it('should remove ingredient by id', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        { ...mockIngredient, id: 'id-1' },
        { ...mockIngredient, id: 'id-2' }
      ]
    };

    const action = burgerConstructorSlice.actions.removeIngredient('id-1');
    const state = burgerConstructorSlice.reducer(stateWithIngredients, action);

    expect(state.ingredients).toEqual([{ ...mockIngredient, id: 'id-2' }]);
  });
});

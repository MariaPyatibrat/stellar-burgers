import { orderReducer, initialState, clearOrder } from './orderSlice';
import { TOrder } from '@utils-types';

jest.mock('../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

describe('orderSlice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Test Order',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 12345
  };

  it('should return initial state', () => {
    const expectedState = {
      order: null,
      isLoading: false,
      error: null
    };
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(expectedState);
  });

  it('should handle clearOrder', () => {
    const stateWithOrder = {
      ...initialState,
      order: mockOrder,
      error: 'Some error'
    };
    const state = orderReducer(stateWithOrder, clearOrder());
    expect(state.order).toBeNull();
    expect(state.error).toBeNull();
  });
});

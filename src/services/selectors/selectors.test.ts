import { selectOrder } from '../slice/orderSlice';

describe('selectors', () => {
  it('should select order state', () => {
    const mockState = {
      order: {
        order: { number: 123 },
        isLoading: false,
        error: null
      }
    };
    expect(selectOrder(mockState)).toEqual(mockState.order);
  });
});

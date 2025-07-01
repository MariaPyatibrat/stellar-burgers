import { createMockRootState } from '../test-utils';
import { selectOrder } from '../slice/orderSlice';
import { createMockOrder } from '../test-utils';

describe('selectors', () => {
  it('should select order state', () => {
    const mockState = createMockRootState({
      order: {
        order: createMockOrder({ number: 123 }),
        isLoading: false,
        error: null
      }
    });
    expect(selectOrder(mockState)).toEqual(mockState.order);
  });
});

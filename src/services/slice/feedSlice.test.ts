import {
  feedSlice,
  initialState,
  getFeeds,
  getUserOrders,
  selectFeeds,
  selectUserOrders
} from './feedSlice';

jest.mock('../../utils/burger-api');

const mockOrder = {
  _id: '1',
  ingredients: ['ing1', 'ing2'],
  status: 'done',
  name: 'Order 1',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  number: 1
};

const mockFeedsData = {
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

describe('feedSlice', () => {
  describe('async thunks', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('getFeeds', () => {
      it('should handle pending', () => {
        const state = feedSlice.reducer(initialState, getFeeds.pending(''));
        expect(state).toEqual({
          ...initialState,
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled', () => {
        const action = {
          type: getFeeds.fulfilled.type,
          payload: mockFeedsData // Используем полную структуру с orders, total, totalToday
        };
        const state = feedSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          orders: mockFeedsData.orders,
          total: mockFeedsData.total,
          totalToday: mockFeedsData.totalToday,
          isLoading: false
        });
      });
    });

    describe('getUserOrders', () => {
      it('should handle fulfilled', () => {
        const action = {
          type: getUserOrders.fulfilled.type,
          payload: [mockOrder] // Для userOrders передаем массив заказов
        };
        const state = feedSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          userOrders: [mockOrder],
          isLoading: false
        });
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      feed: {
        orders: [mockOrder],
        userOrders: [mockOrder],
        total: 100,
        totalToday: 10,
        isLoading: false,
        error: null
      }
    };

    it('should select feeds', () => {
      expect(selectFeeds(mockState)).toEqual(mockState.feed);
    });

    it('should select user orders', () => {
      expect(selectUserOrders(mockState)).toEqual([mockOrder]);
    });
  });
});

import {
  feedSlice,
  initialState,
  getFeeds,
  getUserOrders,
  selectFeeds,
  selectUserOrders
} from './feedSlice';
import { TOrder, TOrdersData } from '@utils-types';
import { RootState } from '../store';

jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Order 1',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 1
  },
  {
    _id: '2',
    ingredients: ['ing3', 'ing4'],
    status: 'pending',
    name: 'Order 2',
    createdAt: '2023-01-02',
    updatedAt: '2023-01-02',
    number: 2
  }
];

const mockFeedsData: TOrdersData = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('feedSlice', () => {
  describe('initial state', () => {
    it('should return initial state', () => {
      expect(feedSlice.reducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('async thunks', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('getFeeds', () => {
      it('should handle pending state', () => {
        const state = feedSlice.reducer(initialState, getFeeds.pending(''));
        expect(state).toEqual({
          ...initialState,
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled state', () => {
        const action = {
          type: getFeeds.fulfilled.type,
          payload: mockFeedsData
        };
        const state = feedSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          orders: mockOrders,
          total: 100,
          totalToday: 10,
          isLoading: false
        });
      });

      it('should handle rejected state', () => {
        const errorMessage = 'Network Error';
        const action = {
          type: getFeeds.rejected.type,
          error: { message: errorMessage }
        };
        const state = feedSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          error: errorMessage
        });
      });
    });

    describe('getUserOrders', () => {
      it('should handle pending state', () => {
        const state = feedSlice.reducer(
          initialState,
          getUserOrders.pending('')
        );
        expect(state).toEqual({
          ...initialState,
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled state', () => {
        const action = {
          type: getUserOrders.fulfilled.type,
          payload: mockOrders
        };
        const state = feedSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          userOrders: mockOrders,
          isLoading: false
        });
      });

      it('should handle rejected state with payload', () => {
        const errorMessage = 'Auth Error';
        const action = {
          type: getUserOrders.rejected.type,
          payload: errorMessage
        };
        const state = feedSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          error: errorMessage
        });
      });

      it('should handle rejected state with error', () => {
        const errorMessage = 'Ошибка загрузки заказов пользователя';
        const action = {
          type: getUserOrders.rejected.type,
          error: { message: errorMessage }
        };
        const state = feedSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          error: errorMessage
        });
      });
    });
  });

  describe('selectors', () => {
    const mockState: RootState = {
      feed: {
        orders: mockOrders,
        userOrders: [mockOrders[0]],
        total: 100,
        totalToday: 10,
        isLoading: false,
        error: null
      }
      // Другие части состояния...
    } as RootState;

    it('should select all feeds', () => {
      const result = selectFeeds(mockState);
      expect(result).toEqual(mockState.feed);
    });

    it('should select user orders', () => {
      const result = selectUserOrders(mockState);
      expect(result).toEqual([mockOrders[0]]);
    });
  });

  describe('integration tests', () => {
    it('should dispatch getFeeds and update state', async () => {
      const { getFeedsApi } = require('../../utils/burger-api');
      getFeedsApi.mockResolvedValue(mockFeedsData);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const extra = {};

      await getFeeds()(dispatch, getState, extra);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: getFeeds.pending.type })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getFeeds.fulfilled.type,
          payload: mockFeedsData
        })
      );
    });

    it('should dispatch getUserOrders and handle error', async () => {
      const { getOrdersApi } = require('../../utils/burger-api');
      const errorMessage = 'Не удалось загрузить заказы пользователя';
      getOrdersApi.mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();
      const extra = {};

      await getUserOrders()(dispatch, getState, extra);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: getUserOrders.pending.type })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getUserOrders.rejected.type,
          payload: errorMessage
        })
      );
    });
  });
});

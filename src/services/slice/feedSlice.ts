import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api'; // Добавляем импорт getOrdersApi
import { RootState } from '../store';

type TFeedState = {
  orders: TOrder[];
  userOrders: TOrder[]; // Добавляем отдельное поле для заказов пользователя
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  userOrders: [], // Инициализируем пустым массивом
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk('feed/getAll', async () => {
  const response = await getFeedsApi();
  return response;
});

// Добавляем новый thunk для получения заказов пользователя
export const getUserOrders = createAsyncThunk(
  'feed/getUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      // Добавляем обработку для getUserOrders
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки заказов пользователя';
      });
  }
});

export const feedReducer = feedSlice.reducer;
export const selectFeeds = (state: RootState) => state.feed;
// Добавляем селектор для заказов пользователя
export const selectUserOrders = (state: RootState) => state.feed.userOrders;

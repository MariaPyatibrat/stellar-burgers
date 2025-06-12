import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { logoutApi, updateUserApi, registerUserApi } from '@api';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null
};

// Асинхронный thunk для обновления пользователя
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: { name?: string; email?: string; password?: string }) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

// Аналогично, если нужно, можно переписать registerUser с createAsyncThunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    userData: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    const data = await registerUserApi(userData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      });
  }
});

// Экспортируем actions и selectors
export const { setAuth, setUser, clearAuth } = authSlice.actions;
export const getIsAuth = (state: RootState) => state.auth.isAuthenticated;
export const getUser = (state: RootState) => state.auth.user;
export const selectUserOrders = (state: RootState) => state.feed.orders;

// Экспортируем thunk logout
export const logoutUser = () => async (dispatch: any) => {
  await logoutApi();
  dispatch(clearAuth());
};

export default authSlice.reducer;

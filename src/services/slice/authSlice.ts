import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { logoutApi, updateUserApi, registerUserApi, loginUserApi } from '@api';

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
  }
});

// Экспортируем actions и selectors
export const { setAuth, setUser, clearAuth } = authSlice.actions;
export const getIsAuth = (state: RootState) => state.auth.isAuthenticated;
export const getUser = (state: RootState) => state.auth.user;

// Экспортируем thunks
export const logoutUser = () => async (dispatch: any) => {
  await logoutApi();
  dispatch(clearAuth());
};

export const updateUser =
  (userData: { name?: string; email?: string; password?: string }) =>
  async (dispatch: any) => {
    const data = await updateUserApi(userData);
    dispatch(setUser(data.user));
    return data;
  };

export default authSlice.reducer;

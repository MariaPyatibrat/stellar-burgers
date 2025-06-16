import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { logoutApi, updateUserApi, registerUserApi, getUserApi } from '@api';
import { deleteCookie } from '../../utils/cookie';

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

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: { name?: string; email?: string; password?: string }) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { name: string; email: string; password: string }) => {
    const data = await registerUserApi(userData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, thunkAPI) => {
    try {
      const data = await getUserApi();
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await logoutApi();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      dispatch(clearAuth());
      return response;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      dispatch(clearAuth());
      return rejectWithValue(error);
    }
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
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export const { setAuth, setUser, clearAuth } = authSlice.actions;
export const getIsAuth = (state: RootState) => state.auth.isAuthenticated;
export const getUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;

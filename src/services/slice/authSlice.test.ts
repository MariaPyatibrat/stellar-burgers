import { initialState, authSlice } from './authSlice';

jest.mock('@api');

describe('authSlice', () => {
  it('should have correct initial state', () => {
    expect(initialState).toEqual({
      isAuthenticated: false,
      isCheckUser: false,
      user: null,
      error: undefined
    });
  });

  it('should handle setAuth action', () => {
    const state = authSlice.reducer(
      initialState,
      authSlice.actions.setAuth(true)
    );
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle clearAuth action', () => {
    const stateWithAuth = {
      ...initialState,
      isAuthenticated: true,
      user: { name: 'Test', email: 'test@test.com' }
    };
    const state = authSlice.reducer(
      stateWithAuth,
      authSlice.actions.clearAuth()
    );
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});

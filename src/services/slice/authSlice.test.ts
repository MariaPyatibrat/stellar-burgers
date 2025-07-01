import { authSlice, AuthState } from './authSlice';

const mockUser = {
    name: 'Test',
    email: 'test@test.com'
};

describe('authSlice', () => {
    const initialState: AuthState = {
        isAuthenticated: false,
        isCheckUser: false,
        user: null,
        error: undefined
    };

    it('should return initial state', () => {
        expect(authSlice.reducer(undefined, { type: '' })).toEqual(initialState);
    });

    describe('sync actions', () => {
        it('should handle setAuth', () => {
            const state = authSlice.reducer(
                initialState,
                authSlice.actions.setAuth(true)
            );
            expect(state.isAuthenticated).toBe(true);
        });

        it('should handle setUser', () => {
            const state = authSlice.reducer(
                initialState,
                authSlice.actions.setUser(mockUser)
            );
            expect(state.user).toEqual(mockUser);
        });

        it('should handle clearAuth', () => {
            const state = authSlice.reducer(
                { ...initialState, isAuthenticated: true, user: mockUser },
                authSlice.actions.clearAuth()
            );
            expect(state).toEqual({
                ...initialState,
                isAuthenticated: false,
                user: null
            });
        });

        it('should handle checkUser', () => {
            const state = authSlice.reducer(
                initialState,
                authSlice.actions.checkUser()
            );
            expect(state.isCheckUser).toBe(true);
        });
    });

    describe('async thunks', () => {
        it('should handle registerUser/fulfilled', () => {
            const action = {
                type: 'auth/registerUser/fulfilled',
                payload: { user: mockUser }
            };
            const state = authSlice.reducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                isAuthenticated: true,
                user: mockUser
            });
        });

        it('should handle updateUser/fulfilled', () => {
            const action = {
                type: 'auth/updateUser/fulfilled',
                payload: mockUser
            };
            const state = authSlice.reducer(
                { ...initialState, user: { name: 'Old', email: 'old@test.com' } },
                action
            );
            expect(state.user).toEqual(mockUser);
        });

        it('should handle checkUserAuth/fulfilled', () => {
            const action = {
                type: 'auth/checkUserAuth/fulfilled',
                payload: mockUser
            };
            const state = authSlice.reducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                isAuthenticated: true,
                user: mockUser
            });
        });

        it('should handle checkUserAuth/rejected', () => {
            const action = {
                type: 'auth/checkUserAuth/rejected'
            };
            const state = authSlice.reducer(
                { ...initialState, isAuthenticated: true, user: mockUser },
                action
            );
            expect(state).toEqual({
                ...initialState,
                isAuthenticated: false,
                user: null
            });
        });

        it('should handle logoutUser/fulfilled', () => {
            const action = {
                type: 'auth/logout/fulfilled'
            };
            const state = authSlice.reducer(
                { ...initialState, isAuthenticated: true, user: mockUser },
                action
            );
            expect(state).toEqual({
                ...initialState,
                isAuthenticated: false,
                user: null
            });
        });

        it('should handle logoutUser/rejected', () => {
            const action = {
                type: 'auth/logout/rejected'
            };
            const state = authSlice.reducer(
                { ...initialState, isAuthenticated: true, user: mockUser },
                action
            );
            expect(state).toEqual({
                ...initialState,
                isAuthenticated: false,
                user: null
            });
        });
    });
});

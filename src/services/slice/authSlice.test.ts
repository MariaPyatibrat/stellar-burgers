// authSlice.test.ts
import { authSlice, initialState } from './authSlice';

const mockUser = {
    name: 'Test',
    email: 'test@test.com'
};

describe('authSlice', () => {
    it('должен возвращать начальное состояние', () => {
        expect(authSlice.reducer(undefined, { type: '' })).toEqual(initialState);
    });

    describe('синхронные действия', () => {
        it('должен обрабатывать setAuth', () => {
            const state = authSlice.reducer(
                initialState,
                authSlice.actions.setAuth(true)
            );
            expect(state.isAuthenticated).toBe(true);
        });

        it('должен обрабатывать setUser', () => {
            const state = authSlice.reducer(
                initialState,
                authSlice.actions.setUser(mockUser)
            );
            expect(state.user).toEqual(mockUser);
        });

        it('должен обрабатывать clearAuth', () => {
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

        it('должен обрабатывать checkUser', () => {
            const state = authSlice.reducer(
                initialState,
                authSlice.actions.checkUser()
            );
            expect(state.isCheckUser).toBe(true);
        });
    });

    describe('асинхронные санки', () => {
        it('должен обрабатывать registerUser/fulfilled', () => {
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

        it('должен обрабатывать updateUser/fulfilled', () => {
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

        it('должен обрабатывать checkUserAuth/fulfilled', () => {
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

        it('должен обрабатывать checkUserAuth/rejected', () => {
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

        it('должен обрабатывать logoutUser/fulfilled', () => {
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

        it('должен обрабатывать logoutUser/rejected', () => {
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

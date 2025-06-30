import { authSlice } from './authSlice';

const mockUser = {
    name: 'Test',
    email: 'test@test.com'
};

describe('authSlice', () => {
    const initialState = {
        isAuthenticated: false,
        isCheckUser: false,
        user: null,
        error: undefined
    };

    const testAction = (action: any, expectedChanges: object) => {
        const state = authSlice.reducer(initialState, action);
        expect(state).toEqual({ ...initialState, ...expectedChanges });
    };

    it('should return initial state', () => {
        expect(authSlice.reducer(undefined, { type: '' })).toEqual(initialState);
    });

    describe('actions', () => {
        it('should handle setAuth', () => {
            testAction(
                authSlice.actions.setAuth(true),
                { isAuthenticated: true }
            );
        });

        it('should handle clearAuth', () => {
            testAction(
                authSlice.actions.clearAuth(),
                { isAuthenticated: false, user: null }
            );
        });
    });
});

import { RootState, TIngredient, TOrder, TUser } from '../utils/types';

export const createMockRootState = (partialState: Partial<RootState> = {}): RootState => ({
    ingredients: {
        ingredients: [],
        isLoading: false,
        error: null,
        ...partialState.ingredients
    },
    burgerConstructor: {
        bun: null,
        ingredients: [],
        ...partialState.burgerConstructor
    },
    order: {
        order: null,
        isLoading: false,
        error: null,
        ...partialState.order
    },
    feed: {
        orders: [],
        userOrders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null,
        ...partialState.feed
    },
    auth: {
        isAuthenticated: false,
        isCheckUser: false,
        user: null,
        error: undefined,
        ...partialState.auth
    }
});

export const createMockIngredient = (overrides: Partial<TIngredient> = {}): TIngredient => ({
    _id: '1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 3,
    calories: 100,
    price: 200,
    image: '',
    image_large: '',
    image_mobile: '',
    ...overrides
});

export const createMockOrder = (overrides: Partial<TOrder> = {}): TOrder => ({
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Test Order',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 1,
    ...overrides
});

export const createMockUser = (overrides: Partial<TUser> = {}): TUser => ({
    email: 'test@example.com',
    name: 'Test User',
    ...overrides
});

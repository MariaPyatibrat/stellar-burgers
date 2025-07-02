import { rootReducer } from './rootReducer';
import { ingredientsReducer } from './slice/ingredientsSlice';
import { burgerConstructorReducer } from './slice/burgerConstructorSlice';
import { orderReducer } from './slice/orderSlice';

describe('rootReducer', () => {
  it('should return the initial state', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      burgerConstructor: burgerConstructorReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      order: orderReducer(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });

  it('should combine all reducers correctly', () => {
    const testAction = { type: 'TEST_ACTION' };
    const state = rootReducer(undefined, testAction);

    expect(state.ingredients).toEqual(
      ingredientsReducer(undefined, testAction)
    );
    expect(state.burgerConstructor).toEqual(
      burgerConstructorReducer(undefined, testAction)
    );
    expect(state.order).toEqual(orderReducer(undefined, testAction));
  });
});

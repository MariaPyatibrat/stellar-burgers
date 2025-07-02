export const logoutApi = jest.fn().mockResolvedValue({ success: true });
export const updateUserApi = jest.fn().mockResolvedValue({
  success: true,
  user: { name: 'Test', email: 'test@test.com' }
});
export const registerUserApi = jest.fn().mockResolvedValue({
  success: true,
  user: { name: 'Test', email: 'test@test.com' },
  accessToken: 'mock-token',
  refreshToken: 'mock-refresh-token'
});
export const getUserApi = jest.fn().mockResolvedValue({
  success: true,
  user: { name: 'Test', email: 'test@test.com' }
});

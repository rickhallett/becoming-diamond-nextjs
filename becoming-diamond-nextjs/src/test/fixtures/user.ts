export const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  image: '/images/avatar.jpg',
};

export const mockUserNoImage = {
  id: 'user-456',
  name: 'John Doe',
  email: 'john@example.com',
  image: null,
};

export const mockUserSingleName = {
  id: 'user-789',
  name: 'Madonna',
  email: 'madonna@example.com',
  image: null,
};

export const mockSession = {
  user: mockUser,
  expires: '2025-12-31',
};

export const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg',
  createdAt: new Date('2024-01-01').toISOString(),
};

export const mockSession = {
  user: mockUser,
  expires: '2099-12-31',
};

export const mockGitHubUser = {
  login: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  avatar_url: 'https://example.com/avatar.jpg',
  id: 12345,
};

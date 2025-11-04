import { http, HttpResponse } from 'msw';

export const handlers = [
  // GitHub OAuth
  http.post('https://github.com/login/oauth/access_token', () => {
    return HttpResponse.json({
      access_token: 'gho_test_token',
      token_type: 'bearer',
      scope: 'repo,user',
    });
  }),

  // GitHub User API
  http.get('https://api.github.com/user', () => {
    return HttpResponse.json({
      login: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      avatar_url: 'https://example.com/avatar.jpg',
    });
  }),

  // Stripe API
  http.post('https://api.stripe.com/v1/checkout/sessions', () => {
    return HttpResponse.json({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/test',
    });
  }),

  // Bunny Stream (future)
  http.get('https://video.bunnycdn.com/library/*/videos/*', () => {
    return HttpResponse.json({
      videoLibraryId: 12345,
      guid: 'abc-123',
      status: 4, // Ready
    });
  }),
];

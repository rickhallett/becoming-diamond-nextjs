import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { UserAvatar } from '@/components/auth/UserAvatar';
import { mockUser, mockUserNoImage, mockUserSingleName } from '@/test/fixtures/user';

// Mock next-auth
const mockUseSession = vi.fn();
vi.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
}));

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="user-image" />;
  },
}));

// Mock Tabler Icons
vi.mock('@tabler/icons-react', () => ({
  IconUser: () => <div data-testid="icon-user">User Icon</div>,
}));

describe('UserAvatar', () => {
  it('should show default icon when no session', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<UserAvatar />);
    expect(screen.getByTestId('icon-user')).toBeInTheDocument();
  });

  it('should render user image when available', () => {
    mockUseSession.mockReturnValue({
      data: { user: mockUser },
      status: 'authenticated',
    });
    render(<UserAvatar />);
    const image = screen.getByTestId('user-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockUser.image);
    expect(image).toHaveAttribute('alt', mockUser.name);
  });

  it('should show initials when no image provided', () => {
    mockUseSession.mockReturnValue({
      data: { user: mockUserNoImage },
      status: 'authenticated',
    });
    render(<UserAvatar />);
    expect(screen.getByText('JD')).toBeInTheDocument(); // John Doe -> JD
  });

  it('should handle single name correctly', () => {
    mockUseSession.mockReturnValue({
      data: { user: mockUserSingleName },
      status: 'authenticated',
    });
    render(<UserAvatar />);
    expect(screen.getByText('M')).toBeInTheDocument(); // Madonna -> M
  });

  it('should use email initial as fallback', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { email: 'test@example.com', name: null, image: null },
      },
      status: 'authenticated',
    });
    render(<UserAvatar />);
    expect(screen.getByText('T')).toBeInTheDocument(); // test@example.com -> T
  });

  it('should apply custom className', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    const { container } = render(<UserAvatar className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('should apply custom size', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    const { container } = render(<UserAvatar size={60} />);
    const avatar = container.querySelector('[style*="width: 60px"]');
    expect(avatar).toBeInTheDocument();
  });

  it('should use default size of 40px', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    const { container } = render(<UserAvatar />);
    const avatar = container.querySelector('[style*="width: 40px"]');
    expect(avatar).toBeInTheDocument();
  });
});

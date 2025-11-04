import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { SignOutButton } from '@/components/auth/SignOutButton';

// Mock next-auth
const mockSignOut = vi.fn(() => Promise.resolve());
vi.mock('next-auth/react', () => ({
  signOut: (options?: any) => mockSignOut(options),
}));

// Mock Tabler Icons
vi.mock('@tabler/icons-react', () => ({
  IconLogout: () => <div data-testid="icon-logout">Logout Icon</div>,
}));

describe('SignOutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sign out button', () => {
    render(<SignOutButton />);
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('should show icon by default', () => {
    render(<SignOutButton />);
    expect(screen.getByTestId('icon-logout')).toBeInTheDocument();
  });

  it('should hide icon when showIcon is false', () => {
    render(<SignOutButton showIcon={false} />);
    expect(screen.queryByTestId('icon-logout')).not.toBeInTheDocument();
  });

  it('should call signOut when clicked', async () => {
    const user = userEvent.setup();
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /sign out/i });
    await user.click(button);

    expect(mockSignOut).toHaveBeenCalledOnce();
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });

  it('should show loading state during signout', async () => {
    const user = userEvent.setup();
    // Make signOut slow to test loading state
    mockSignOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<SignOutButton />);
    const button = screen.getByRole('button', { name: /sign out/i });

    await user.click(button);

    // Should show loading text immediately after click
    expect(screen.getByText('Signing out...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Wait for signOut to complete
    await waitFor(() => expect(mockSignOut).toHaveBeenCalled());
  });

  it('should disable button during signout', async () => {
    const user = userEvent.setup();
    mockSignOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)));

    render(<SignOutButton />);
    const button = screen.getByRole('button', { name: /sign out/i });

    await user.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('should apply custom className', () => {
    render(<SignOutButton className="custom-class" />);
    const button = screen.getByRole('button', { name: /sign out/i });
    expect(button).toHaveClass('custom-class');
  });

  it('should have proper hover styles', () => {
    render(<SignOutButton />);
    const button = screen.getByRole('button', { name: /sign out/i });
    expect(button).toHaveClass('hover:text-white');
    expect(button).toHaveClass('hover:bg-white/5');
  });
});

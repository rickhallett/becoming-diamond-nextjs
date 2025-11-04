import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import CourseProgress from '@/components/course/CourseProgress';
import { mockCourse } from '@/test/fixtures/course';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock Tabler Icons
vi.mock('@tabler/icons-react', () => ({
  IconMenu2: () => <div data-testid="icon-menu">Menu Icon</div>,
}));

describe('CourseProgress', () => {
  const mockOnMenuToggle = vi.fn();

  const defaultProps = {
    course: mockCourse,
    currentSlideIndex: 0,
    totalSlides: 3,
    progress: 33,
    onMenuToggle: mockOnMenuToggle,
  };

  it('should render course title', () => {
    render(<CourseProgress {...defaultProps} />);
    expect(screen.getByText('Test Course')).toBeInTheDocument();
  });

  it('should display current slide number (1-indexed)', () => {
    render(<CourseProgress {...defaultProps} />);
    // Text is in a container with class "hidden sm:flex" so use getAllByText or regex
    expect(screen.getByText(/Slide/)).toBeInTheDocument();
    expect(screen.getByText(/of\s+3/)).toBeInTheDocument(); // "of 3" text
  });

  it('should display progress percentage rounded', () => {
    render(<CourseProgress {...defaultProps} progress={33.7} />);
    expect(screen.getByText('34%')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('should show 0% when no progress made', () => {
    render(<CourseProgress {...defaultProps} progress={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should show 100% when course completed', () => {
    render(<CourseProgress {...defaultProps} progress={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should show completion message at 100%', () => {
    render(<CourseProgress {...defaultProps} progress={100} />);
    expect(screen.getByText('🎉 Course Completed!')).toBeInTheDocument();
  });

  it('should not show completion message below 100%', () => {
    render(<CourseProgress {...defaultProps} progress={99} />);
    expect(screen.queryByText('🎉 Course Completed!')).not.toBeInTheDocument();
  });

  it('should render progress bar with correct width', () => {
    const { container } = render(<CourseProgress {...defaultProps} progress={75} />);
    const progressBar = container.querySelector('[style*="width: 75%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should call onMenuToggle when menu button is clicked', async () => {
    const user = userEvent.setup();
    render(<CourseProgress {...defaultProps} />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(menuButton);
    expect(mockOnMenuToggle).toHaveBeenCalledOnce();
  });

  it('should render menu toggle button with aria-label', () => {
    render(<CourseProgress {...defaultProps} />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu');
  });

  it('should render link back to courses', () => {
    render(<CourseProgress {...defaultProps} />);
    const link = screen.getByText('← Courses');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/app/courses');
  });

  it('should handle different slide indices correctly', () => {
    render(<CourseProgress {...defaultProps} currentSlideIndex={2} />);
    expect(screen.getByText('3')).toBeInTheDocument(); // Index 2 + 1 = 3
  });
});

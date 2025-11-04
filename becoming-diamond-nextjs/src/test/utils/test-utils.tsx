import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Wrapper for providers (can add ThemeProvider, etc. later if needed)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };

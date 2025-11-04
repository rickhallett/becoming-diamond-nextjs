import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { MarkdownMessage } from '@/components/MarkdownMessage';

// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children, language }: { children: string; language: string }) => (
    <pre data-testid="syntax-highlighter" data-language={language}>
      <code>{children}</code>
    </pre>
  ),
}));

vi.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  vscDarkPlus: {},
}));

describe('MarkdownMessage', () => {
  it('should render basic markdown text', () => {
    render(<MarkdownMessage content="Hello world" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('should render headings', () => {
    const content = '# Heading 1\n## Heading 2\n### Heading 3';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
    expect(screen.getByText('Heading 3')).toBeInTheDocument();
  });

  it('should render paragraphs', () => {
    const content = 'First paragraph\n\nSecond paragraph';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('should render unordered lists', () => {
    const content = '- Item 1\n- Item 2\n- Item 3';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should render ordered lists', () => {
    const content = '1. First\n2. Second\n3. Third';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('should render code blocks with syntax highlighting', () => {
    const content = '```javascript\nconst x = 10;\n```';
    render(<MarkdownMessage content={content} />);
    const codeBlock = screen.getByTestId('syntax-highlighter');
    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock).toHaveAttribute('data-language', 'javascript');
    expect(screen.getByText('const x = 10;')).toBeInTheDocument();
  });

  it('should render inline code', () => {
    const content = 'Use `console.log()` for debugging';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('console.log()')).toBeInTheDocument();
  });

  it('should render blockquotes', () => {
    const content = '> This is a quote';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('This is a quote')).toBeInTheDocument();
  });

  it('should render links', () => {
    const content = '[Click here](https://example.com)';
    render(<MarkdownMessage content={content} />);
    const link = screen.getByText('Click here');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should render bold text', () => {
    const content = '**bold text**';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('bold text')).toBeInTheDocument();
  });

  it('should render italic text', () => {
    const content = '*italic text*';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('italic text')).toBeInTheDocument();
  });

  it('should handle empty content', () => {
    const { container } = render(<MarkdownMessage content="" />);
    expect(container).toBeInTheDocument();
  });

  it('should render GFM features - strikethrough', () => {
    const content = '~~strikethrough~~';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('strikethrough')).toBeInTheDocument();
  });

  it('should render GFM features - task lists', () => {
    const content = '- [ ] Unchecked\n- [x] Checked';
    render(<MarkdownMessage content={content} />);
    expect(screen.getByText(/Unchecked/)).toBeInTheDocument();
    expect(screen.getByText(/Checked/)).toBeInTheDocument();
  });

  it('should support multiple code languages', () => {
    const pythonCode = '```python\nprint("hello")\n```';
    render(<MarkdownMessage content={pythonCode} />);
    const codeBlock = screen.getByTestId('syntax-highlighter');
    expect(codeBlock).toHaveAttribute('data-language', 'python');
  });

  it('should handle mixed markdown content', () => {
    const content = `# Title

This is a paragraph with **bold** and *italic*.

- List item 1
- List item 2

\`inline code\`

> A quote`;

    render(<MarkdownMessage content={content} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('bold')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
    expect(screen.getByText('inline code')).toBeInTheDocument();
  });
});

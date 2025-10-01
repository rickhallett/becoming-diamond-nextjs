import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MarkdownMessageProps {
  content: string;
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings with primary color and compact spacing (30% smaller)
        h1: ({ children }) => (
          <h1 className="text-base font-bold text-primary mt-3 mb-2 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-semibold text-primary mt-2.5 mb-1.5 first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-gray-200 mt-2 mb-1 first:mt-0">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-xs font-semibold text-gray-300 mt-1.5 mb-1 first:mt-0">
            {children}
          </h4>
        ),

        // Paragraphs with compact spacing
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-normal text-gray-100 text-sm">
            {children}
          </p>
        ),

        // Unordered lists - compact
        ul: ({ children }) => (
          <ul className="list-none space-y-1 mb-2 ml-3">
            {children}
          </ul>
        ),

        // Ordered lists - compact
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-2 ml-3">
            {children}
          </ol>
        ),

        // List items with custom bullet - compact
        li: ({ children }) => (
          <li className="flex items-start gap-1.5 text-sm">
            <span className="text-primary mt-0.5 flex-shrink-0 text-xs">•</span>
            <span className="flex-1">{children}</span>
          </li>
        ),

        // Blockquotes - compact
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-primary pl-3 py-1 my-2 italic text-gray-300 bg-primary/5 text-sm">
            {children}
          </blockquote>
        ),

        // Code blocks with syntax highlighting - compact
        code: ({ inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          return !inline && language ? (
            <div className="my-2 rounded-lg overflow-hidden">
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: '0.5rem',
                  background: 'rgba(0, 0, 0, 0.5)',
                  fontSize: '0.75rem',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              className="px-1 py-0.5 bg-primary/20 text-primary rounded text-xs font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },

        // Links - compact
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline transition-colors text-sm"
          >
            {children}
          </a>
        ),

        // Tables - compact
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full border border-white/10 text-xs">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-primary/10">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-2 py-1 text-left font-semibold text-primary border-b border-white/10 text-xs">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-2 py-1 border-b border-white/10 text-xs">
            {children}
          </td>
        ),

        // Horizontal rule - compact
        hr: () => (
          <hr className="my-3 border-white/10" />
        ),

        // Strong/Bold - compact
        strong: ({ children }) => (
          <strong className="font-bold text-white text-sm">
            {children}
          </strong>
        ),

        // Emphasis/Italic - compact
        em: ({ children }) => (
          <em className="italic text-gray-200 text-sm">
            {children}
          </em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

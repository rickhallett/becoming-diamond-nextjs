"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { IconCopy, IconCheck } from "@tabler/icons-react";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700
            text-xs text-white rounded border border-neutral-700 transition-colors"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <>
              <IconCheck className="h-3 w-3" />
              Copied!
            </>
          ) : (
            <>
              <IconCopy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          background: '#0a0a0a',
          border: '1px solid #262626',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          margin: 0,
        }}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

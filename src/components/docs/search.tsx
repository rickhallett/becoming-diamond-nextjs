"use client";

import { useState, useMemo, useEffect } from "react";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import Fuse from 'fuse.js';

interface SearchResult {
  title: string;
  href: string;
  description: string;
  category: string;
}

interface DocsSearchProps {
  pages: SearchResult[];
}

export function DocsSearch({ pages }: DocsSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const searchIndex = useMemo(() => {
    return new Fuse(pages, {
      keys: ['title', 'description', 'category'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [pages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('docs-search')?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      const searchResults = searchIndex.search(value);
      setResults(searchResults.map(r => r.item).slice(0, 8));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <input
          id="docs-search"
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Search docs... (⌘K)"
          className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg
            text-sm text-white placeholder:text-neutral-500
            focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-neutral-900 border border-neutral-800
          rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <Link
              key={index}
              href={result.href}
              className="block px-4 py-3 hover:bg-neutral-800 transition-colors group"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                    {result.title}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                    {result.description}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {result.category}
                  </p>
                </div>
                <IconArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-primary
                  group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && query.length > 2 && (
        <div className="absolute top-full mt-2 w-full bg-neutral-900 border border-neutral-800
          rounded-lg shadow-xl z-50 p-4">
          <p className="text-sm text-neutral-400">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 1.0,
      }
    );

    document.querySelectorAll('h2, h3').forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden xl:block w-64 ml-12">
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">
        On This Page
      </p>
      <ul className="space-y-2 text-sm border-l border-neutral-800">
        {items.map((item) => (
          <li
            key={item.id}
            className={`pl-4 ${item.level === 3 ? 'ml-4' : ''}`}
          >
            <a
              href={`#${item.id}`}
              className={`block py-1 transition-colors ${
                activeId === item.id
                  ? 'text-primary border-l-2 border-primary -ml-[1px] pl-[15px]'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

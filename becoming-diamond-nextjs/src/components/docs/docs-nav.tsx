"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "Getting Started",
    href: "/docs-site",
  },
  {
    title: "Platform Overview",
    href: "/docs-site/overview",
  },
  {
    title: "User Guide",
    items: [
      {
        title: "Getting Started",
        href: "/docs-site/user/getting-started",
      },
      {
        title: "Sprint Program",
        href: "/docs-site/user/sprint-program",
      },
      {
        title: "Profile Management",
        href: "/docs-site/user/profile",
      },
    ],
  },
  {
    title: "Admin Guide",
    items: [
      {
        title: "CMS Overview",
        href: "/docs-site/admin/cms-overview",
      },
      {
        title: "Managing Sprint Content",
        href: "/docs-site/admin/sprint-management",
      },
      {
        title: "Blog Management",
        href: "/docs-site/admin/blog-management",
      },
      {
        title: "Book Sales",
        href: "/docs-site/admin/book-sales",
      },
      {
        title: "Lead Management",
        href: "/docs-site/admin/lead-management",
      },
      {
        title: "Rollback Procedures",
        href: "/docs-site/admin/rollback",
      },
    ],
  },
  {
    title: "Technical",
    items: [
      {
        title: "Architecture",
        href: "/docs-site/technical/architecture",
      },
      {
        title: "Reports",
        href: "/docs-site/technical/reports",
      },
      {
        title: "Specifications",
        href: "/docs-site/technical/specs",
      },
    ],
  },
  {
    title: "Support",
    href: "/docs-site/support",
  },
];

function NavItemComponent({
  item,
  level = 0,
  onNavigate
}: {
  item: NavItem;
  level?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.items && item.items.length > 0;
  const isActive = item.href === pathname;

  if (hasChildren) {
    return (
      <div className="mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-neutral-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-neutral-900/30 group"
        >
          <div className="text-primary transition-transform group-hover:scale-110">
            {isOpen ? (
              <IconChevronDown className="h-4 w-4" />
            ) : (
              <IconChevronRight className="h-4 w-4" />
            )}
          </div>
          {item.title}
        </button>
        {isOpen && item.items && (
          <div className="ml-4 space-y-1 mt-1 border-l-2 border-neutral-800/50 pl-2">
            {item.items.map((child, index) => (
              <NavItemComponent
                key={index}
                item={child}
                level={level + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      onClick={onNavigate}
      className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 group relative ${
        isActive
          ? "bg-gradient-to-r from-primary/20 to-cyan-500/10 text-primary font-medium border-l-2 border-primary"
          : "text-neutral-400 hover:text-white hover:bg-neutral-900/50 hover:translate-x-1"
      }`}
    >
      <span className="relative z-10">{item.title}</span>
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
      )}
    </Link>
  );
}

export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {navigation.map((item, index) => (
        <NavItemComponent key={index} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

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
        title: "Blog & News",
        href: "/docs-site/admin/blog-news",
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
];

function NavItemComponent({ item, level = 0 }: { item: NavItem; level?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.items && item.items.length > 0;
  const isActive = item.href === pathname;

  if (hasChildren) {
    return (
      <div className="mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
        >
          {isOpen ? (
            <IconChevronDown className="h-4 w-4" />
          ) : (
            <IconChevronRight className="h-4 w-4" />
          )}
          {item.title}
        </button>
        {isOpen && (
          <div className="ml-4 space-y-1 mt-1">
            {item.items.map((child, index) => (
              <NavItemComponent key={index} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-neutral-400 hover:text-white hover:bg-neutral-900"
      }`}
    >
      {item.title}
    </Link>
  );
}

export function DocsNav() {
  return (
    <nav className="space-y-1">
      {navigation.map((item, index) => (
        <NavItemComponent key={index} item={item} />
      ))}
    </nav>
  );
}

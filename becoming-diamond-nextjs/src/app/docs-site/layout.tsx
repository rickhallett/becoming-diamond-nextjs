import { DocsNav } from "@/components/docs/docs-nav";
import Link from "next/link";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 p-6 flex flex-col">
        {/* Logo/Header */}
        <div className="mb-8">
          <Link href="/docs-site" className="block">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Becoming Diamond
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Documentation</p>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <DocsNav />
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-neutral-800">
          <p className="text-xs text-neutral-500">
            Protected Documentation
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            support@becomingdiamond.com
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

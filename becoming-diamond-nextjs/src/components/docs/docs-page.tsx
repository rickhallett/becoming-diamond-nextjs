import { ReactNode } from "react";

interface DocsPageProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DocsPage({ title, description, children }: DocsPageProps) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-neutral-400">{description}</p>
        )}
      </div>

      <div className="prose prose-invert prose-neutral max-w-none">
        {children}
      </div>
    </div>
  );
}

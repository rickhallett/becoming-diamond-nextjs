import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Link from "next/link";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  content: string;
}

export function LegalPage({ title, lastUpdated, content }: LegalPageProps) {
  return (
    <main className="relative bg-black antialiased min-h-screen">
      <Navigation />

      <div className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-500">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div
            className="prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-light
              prose-h1:hidden
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
              prose-p:text-sm prose-p:leading-snug
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-medium
              prose-ul:text-sm prose-ul:space-y-1
              prose-ol:text-sm prose-ol:space-y-1
              prose-li:text-sm
              prose-blockquote:border-l-primary prose-blockquote:text-gray-400 prose-blockquote:text-sm
              prose-code:text-primary prose-code:bg-secondary/50 prose-code:px-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-white/10 prose-pre:text-sm
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Back to Home */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

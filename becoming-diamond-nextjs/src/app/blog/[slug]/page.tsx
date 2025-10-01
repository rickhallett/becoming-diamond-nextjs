import { getContentBySlug, getContentByType } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    author: string;
    date: string;
    thumbnail?: string;
    excerpt: string;
    categories: string[];
    tags: string[];
    published?: boolean;
  };
  content: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = (await getContentByType("blog")) as BlogPost[];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = (await getContentBySlug("blog", slug)) as BlogPost | null;

  if (!post) {
    return {
      title: "Post Not Found | Becoming Diamond",
    };
  }

  return {
    title: `${post.frontmatter.title} | Becoming Diamond Blog`,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: post.frontmatter.thumbnail ? [post.frontmatter.thumbnail] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = (await getContentBySlug("blog", slug)) as BlogPost | null;

  if (!post) {
    notFound();
  }

  // Get related posts (same category)
  const allPosts = (await getContentByType("blog")) as BlogPost[];
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.slug !== slug &&
        p.frontmatter.categories.some((cat) =>
          post.frontmatter.categories.includes(cat)
        )
    )
    .slice(0, 3);

  return (
    <main className="bg-black min-h-screen text-white">
      <Navigation />

      {/* Hero Section with Featured Image */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        {post.frontmatter.thumbnail && (
          <>
            <img
              src={post.frontmatter.thumbnail}
              alt={post.frontmatter.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black z-[1]" />
          </>
        )}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#4fc3f7" />

        <div className="relative z-10 w-full px-6 pb-12 pt-32">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Blog
            </Link>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.frontmatter.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="mb-6">{post.frontmatter.title}</h1>

            {/* Meta */}
            <div className="flex items-center gap-6 text-gray-400">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {post.frontmatter.author}
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Excerpt/Introduction */}
      {post.frontmatter.excerpt && (
        <section className="py-8 px-6 border-b border-white/10">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed italic">
              {post.frontmatter.excerpt}
            </p>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="py-24 px-6 bg-gradient-to-b from-black via-black/95 to-black">
        <div className="max-w-4xl mx-auto">
          {/* Article Body - styled prose */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-thin prose-headings:text-white prose-headings:tracking-wide
              prose-h1:hidden
              prose-h2:text-5xl prose-h2:mb-8 prose-h2:mt-20 prose-h2:text-primary prose-h2:font-extralight prose-h2:first:mt-0 prose-h2:leading-tight
              prose-h2:drop-shadow-[0_0_20px_rgba(79,195,247,0.3)]
              prose-h3:text-3xl prose-h3:mb-6 prose-h3:mt-14 prose-h3:font-light prose-h3:text-white
              prose-h4:text-2xl prose-h4:mb-4 prose-h4:mt-10 prose-h4:font-light prose-h4:text-gray-200
              prose-p:text-gray-300 prose-p:leading-[1.8] prose-p:mb-6 prose-p:font-light prose-p:text-lg
              prose-p:first:text-xl prose-p:first:leading-[1.8] prose-p:first:text-gray-200 prose-p:first:mb-8
              prose-a:text-primary prose-a:no-underline prose-a:font-normal prose-a:border-b prose-a:border-primary/30
              hover:prose-a:border-primary hover:prose-a:text-primary/80 prose-a:transition-all
              prose-strong:text-primary prose-strong:font-semibold prose-strong:bg-primary/10 prose-strong:px-2 prose-strong:py-0.5 prose-strong:rounded
              prose-em:text-gray-400 prose-em:italic
              prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-8 prose-blockquote:py-4 prose-blockquote:my-10
              prose-blockquote:italic prose-blockquote:text-gray-300 prose-blockquote:text-lg prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl
              prose-blockquote:shadow-[0_0_30px_rgba(79,195,247,0.1)]
              prose-ul:text-gray-300 prose-ul:space-y-4 prose-ul:my-8 prose-ul:pl-6
              prose-ol:text-gray-300 prose-ol:space-y-4 prose-ol:my-8 prose-ol:pl-6
              prose-li:leading-[1.8] prose-li:text-lg prose-li:font-light prose-li:pl-2
              prose-li:marker:text-primary prose-li:marker:font-bold prose-li:marker:text-xl
              prose-code:text-primary prose-code:bg-secondary/50 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
              prose-code:before:content-[''] prose-code:after:content-[''] prose-code:border prose-code:border-primary/20
              prose-pre:bg-secondary/50 prose-pre:border-2 prose-pre:border-primary/20 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-10 prose-pre:overflow-x-auto
              prose-pre:shadow-[0_0_40px_rgba(79,195,247,0.15)]
              prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-12 prose-img:border-2 prose-img:border-primary/20
              prose-img:shadow-[0_0_50px_rgba(79,195,247,0.2)]
              prose-hr:border-primary/20 prose-hr:my-12
              prose-table:border-collapse prose-table:my-10 prose-table:border prose-table:border-primary/20 prose-table:rounded-lg prose-table:overflow-hidden
              prose-thead:bg-primary/10 prose-thead:border-b-2 prose-thead:border-primary/30
              prose-th:px-6 prose-th:py-4 prose-th:text-left prose-th:font-medium prose-th:text-primary
              prose-td:px-6 prose-td:py-4 prose-td:border-t prose-td:border-white/10 prose-td:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h4 className="text-sm text-gray-500 mb-4">Tagged with:</h4>
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-secondary border border-white/10 text-gray-400 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-6 bg-secondary/30 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl mb-12 text-center">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <div className="group bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
                    {relatedPost.frontmatter.thumbnail && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={relatedPost.frontmatter.thumbnail}
                          alt={relatedPost.frontmatter.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.frontmatter.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {relatedPost.frontmatter.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-12">
            <h2 className="text-3xl mb-4">Transform Pressure Into Power</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Ready to master your nervous system and lead with clarity?
            </p>
            <Link href="/auth/signin">
              <HoverBorderGradient
                containerClassName="rounded-full inline-block"
                as="button"
                className="bg-primary text-black px-8 py-4 text-lg font-medium"
              >
                Get the Free Diamond Sprint
              </HoverBorderGradient>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

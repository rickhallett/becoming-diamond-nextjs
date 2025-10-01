import { getContentByType } from "@/lib/content";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

// Type for blog post with proper frontmatter
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

export default async function BlogPage() {
  const posts = (await getContentByType("blog")) as BlogPost[];

  // Get unique categories for filtering
  const allCategories = Array.from(
    new Set(posts.flatMap((post) => post.frontmatter.categories || []))
  );

  return (
    <main className="bg-black min-h-screen text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#4fc3f7" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-[1]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
          <h1 className="mb-6">
            The <span className="text-primary">Diamond</span> Blog
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-300 max-w-3xl mx-auto">
            Insights on transformation, leadership, and mastering pressure in the age of AI
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          {allCategories.length > 0 && (
            <div className="mb-12 flex flex-wrap gap-3 justify-center">
              <Link href="/blog">
                <span className="px-4 py-2 bg-primary/20 border border-primary/50 rounded-full text-sm text-primary hover:bg-primary/30 transition-all cursor-pointer">
                  All Posts
                </span>
              </Link>
              {allCategories.map((category) => (
                <Link key={category} href={`/blog?category=${encodeURIComponent(category)}`}>
                  <span className="px-4 py-2 bg-secondary/50 border border-white/10 rounded-full text-sm text-gray-300 hover:border-primary/50 hover:text-primary transition-all cursor-pointer">
                    {category}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="group bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                    {/* Thumbnail */}
                    {post.frontmatter.thumbnail && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.frontmatter.thumbnail}
                          alt={post.frontmatter.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.frontmatter.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.frontmatter.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                        {post.frontmatter.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10">
                        <span>{post.frontmatter.author}</span>
                        <span>
                          {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-12 max-w-3xl mx-auto">
              <h2 className="text-3xl mb-4">Ready to Begin Your Transformation?</h2>
              <p className="text-gray-300 mb-8">
                Join thousands who are mastering pressure and leading with clarity
              </p>
              <Link href="/auth">
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
        </div>
      </section>

      <Footer />
    </main>
  );
}

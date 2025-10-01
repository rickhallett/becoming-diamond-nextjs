import { getContentByType } from '@/lib/content';
import Link from 'next/link';

export default async function NewsPage() {
  const news = await getContentByType('news');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">News</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <article key={item.slug} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/news/${item.slug}`} className="hover:text-blue-600">
                {item.frontmatter.title}
              </Link>
            </h2>
            
            {item.frontmatter.date && (
              <time className="text-sm text-gray-600">
                {new Date(item.frontmatter.date).toLocaleDateString()}
              </time>
            )}
            
            {item.frontmatter.description && (
              <p className="mt-4 text-gray-700">{item.frontmatter.description}</p>
            )}
            
            <Link 
              href={`/news/${item.slug}`}
              className="inline-block mt-4 text-blue-600 hover:text-blue-800"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
      
      {news.length === 0 && (
        <p className="text-gray-600">No news items yet. Check back later!</p>
      )}
    </div>
  );
}
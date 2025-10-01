import { getContentBySlug, getContentByType } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const news = await getContentByType('news');
  return news.map((item) => ({
    slug: item.slug,
  }));
}

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getContentBySlug('news', slug);

  if (!item) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{item.frontmatter.title}</h1>
      
      {item.frontmatter.date && (
        <time className="text-gray-600">
          {new Date(item.frontmatter.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      )}
      
      {item.frontmatter.thumbnail && (
        <img 
          src={item.frontmatter.thumbnail} 
          alt={item.frontmatter.title}
          className="w-full h-64 object-cover rounded-lg my-6"
        />
      )}
      
      <div 
        className="prose prose-lg max-w-none mt-8"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
    </article>
  );
}
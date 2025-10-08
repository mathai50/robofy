import { getAllBlogPosts } from '@/lib/blog-utils';
import BlogArticleClient from './BlogArticleClient';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  return <BlogArticleClient slug={slug} />;
}
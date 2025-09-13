'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/blog-utils';
import Badge from './Badge';

interface ArticleCardProps {
  post: BlogPost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group bg-gray-900 rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-gray-500 hover:scale-[1.02]">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.image || '/images/blog/default.jpg'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className="bg-gray-800 text-gray-300 font-medium px-3 py-1 text-sm border border-gray-600"
            >
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <time
            dateTime={post.date}
            className="text-sm text-gray-400 mb-2 block"
          >
            {formatDate(post.date)}
          </time>
          
          <h2 className="text-xl font-semibold text-white mb-3 leading-tight group-hover:text-gray-300 transition-colors">
            {post.title}
          </h2>
          
          <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{post.readTime} min read</span>
            <span className="text-white font-medium group-hover:text-gray-300 transition-colors">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
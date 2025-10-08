export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  content: string;
  image?: string;
  readTime?: number;
}

export interface BlogFilters {
  category: string;
  searchQuery: string;
}

export const BLOG_CATEGORIES = [
  'all',
  'technology'
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];
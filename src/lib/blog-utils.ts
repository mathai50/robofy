import fs from 'fs';
import path from 'path';
import { BlogPost, BlogCategory } from '@/types/blog';

// Mock image URLs for blog posts - in a real app, these would come from a CMS or file system
const BLOG_IMAGES: Record<string, string> = {
  'beauty': '/images/blog/beauty.jpg',
  'dental': '/images/blog/dental.jpg',
  'fitness': '/images/blog/fitness.jpg',
  'healthcare': '/images/blog/healthcare.jpg',
  'retail': '/images/blog/retail.jpg',
  'solar': '/images/blog/solar.jpg',
  'technology': '/images/blog/technology.jpg',
};

const DEFAULT_IMAGE = '/images/blog/default.jpg';

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  
  // Extract posts from file names - in a real app, we'd read the actual files
  const blogFiles = [
    'blog_ai-marketing-automation-guide.md',
    'blog_beauty_personalized-customer-experiences.md',
    'blog_beauty_social-media-automation-for-salons.md',
    'blog_dental_appointment-reminder-systems.md',
    'blog_dental_dental-seo-content-generation.md',
    'blog_dental_patient-acquisition-automation.md',
    'blog_fitness_fitness-content-marketing.md',
    'blog_fitness_fitness-studio-member-acquisition.md',
    'blog_fitness_workout-program-personalization.md',
    'blog_healthcare_1.md',
    'blog_healthcare_2.md',
    'blog_healthcare_healthcare-content-marketing.md',
    'blog_healthcare_healthcare-digital-marketing-automation.md',
    'blog_healthcare_medical-practice-lead-generation.md',
    'blog_retail_inventory-management-automation.md',
    'blog_retail_retail-e-commerce-automation.md',
    'blog_solar_renewable-energy-marketing.md',
    'blog_solar_solar-energy-lead-generation.md',
    'blog_solar_solar-installation-automation.md',
    'blog_technology_1.md',
  ];

  for (const filename of blogFiles) {
    const post = parseBlogFilename(filename);
    if (post) {
      posts.push(post);
    }
  }

  // Sort by date descending (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function parseBlogFilename(filename: string): BlogPost | null {
  // Handle special case for blog_ai-marketing-automation-guide.md
  if (filename === 'blog_ai-marketing-automation-guide.md') {
    return createBlogPost('technology', 'ai-marketing-automation-guide', filename);
  }

  // Extract category and slug from filename pattern: blog_{category}_{slug}.md
  const match = filename.match(/^blog_([^_]+)_(.+)\.md$/);
  if (!match) {
    // Handle files that don't match the pattern (like blog_technology_1.md)
    const fallbackMatch = filename.match(/^blog_([^_]+)_(\d+)\.md$/);
    if (fallbackMatch) {
      const category = fallbackMatch[1];
      const slug = fallbackMatch[2];
      return createBlogPost(category, slug, filename);
    }
    return null;
  }

  const category = match[1];
  const slug = match[2];
  return createBlogPost(category, slug, filename);
}

function createBlogPost(category: string, slug: string, filename: string): BlogPost {
  // Generate title from slug by replacing hyphens with spaces and capitalizing
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Generate excerpt based on category
  const excerpts: Record<string, string> = {
    beauty: 'Discover AI-powered marketing strategies for beauty businesses to enhance customer experiences and drive growth.',
    dental: 'Learn how dental practices can leverage automation for patient acquisition and appointment management.',
    fitness: 'Explore fitness content marketing and member acquisition strategies powered by AI automation.',
    healthcare: 'Transform healthcare marketing with AI-driven patient engagement and lead generation solutions.',
    retail: 'Optimize retail operations with inventory management and e-commerce automation technologies.',
    solar: 'Drive solar energy lead generation with targeted marketing automation and content strategies.',
    technology: 'Explore comprehensive AI marketing automation strategies, implementation guides, and industry insights for business growth.',
  };

  const excerpt = excerpts[category] || 'Explore insights and strategies for business growth through AI automation.';

  // Generate dates based on filename to simulate different publication dates
  const date = generateDateFromFilename(filename);

  // Calculate approximate read time (3-7 minutes)
  const readTime = Math.floor(Math.random() * 5) + 3;

  return {
    slug: `${category}-${slug}`,
    title,
    excerpt,
    category,
    date: date.toISOString().split('T')[0],
    content: '', // Content would be loaded from file in real implementation
    image: BLOG_IMAGES[category] || DEFAULT_IMAGE,
    readTime,
  };
}

function generateDateFromFilename(filename: string): Date {
  // Generate semi-random dates based on filename hash for variety
  let hash = 0;
  for (let i = 0; i < filename.length; i++) {
    hash = ((hash << 5) - hash) + filename.charCodeAt(i);
    hash = hash & hash;
  }

  const now = new Date();
  const daysAgo = Math.abs(hash) % 365; // Random days up to a year ago
  const date = new Date(now);
  date.setDate(now.getDate() - daysAgo);

  return date;
}

export function filterBlogPosts(posts: BlogPost[], category: BlogCategory, searchQuery: string): BlogPost[] {
  let filtered = posts;

  // Filter by category
  if (category !== 'all') {
    filtered = filtered.filter(post => post.category === category);
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  }

  return filtered;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts();
  return allPosts.find(post => post.slug === slug) || null;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
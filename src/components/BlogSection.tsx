'use client';

import { useState, useEffect } from 'react';
import { BlogPost, BlogCategory } from '@/types/blog';
import { getAllBlogPosts, filterBlogPosts } from '@/lib/blog-utils';
import { FilterBar } from '@/components/ui/FilterBar';
import { SearchInput } from '@/components/ui/SearchInput';
import { ArticleCard } from '@/components/ui/ArticleCard';

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadPosts() {
      const allPosts = await getAllBlogPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
    }
    loadPosts();
  }, []);

  useEffect(() => {
    const filtered = filterBlogPosts(posts, selectedCategory, searchQuery);
    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchQuery]);

  return (
    <section aria-label="Blog articles" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-black">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Resources & Blog</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover the latest insights, strategies, and tips for AI-powered marketing automation across various industries.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search articles by title, content, or category..."
        />
        <div className="lg:text-right">
          <p className="text-sm text-gray-300">
            Showing {filteredPosts.length} of {posts.length} articles
          </p>
        </div>
      </div>

      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 text-white hover:text-gray-300 underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
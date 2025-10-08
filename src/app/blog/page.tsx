"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogPost, BlogCategory } from '@/types/blog';
import { getAllBlogPosts, filterBlogPosts } from '@/lib/blog-utils';
import { FilterBar } from '@/components/ui/FilterBar';
import { SearchInput } from '@/components/ui/SearchInput';
import { ArticleCard } from '@/components/ui/ArticleCard';
import Badge from '@/components/ui/Badge';

// Page-specific animations following organic design principles
const pageAnimations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  item: {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      const allPosts = await getAllBlogPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
      setIsLoading(false);
    }
    loadPosts();
  }, []);

  useEffect(() => {
    const filtered = filterBlogPosts(posts, selectedCategory, searchQuery);
    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section with Organic Layout */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] lg:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_50%)]"></div>

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={pageAnimations.container}
        >
          <div className="text-center mb-16">
            <motion.div
              variants={pageAnimations.item}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge className="mb-6 bg-blue-600/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm font-medium">
                Latest Insights
              </Badge>
            </motion.div>

            <motion.h1
              variants={pageAnimations.item}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              AI Marketing Automation
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Blog & Resources
              </span>
            </motion.h1>

            <motion.p
              variants={pageAnimations.item}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Discover the latest insights, strategies, and tips for AI-powered marketing automation across various industries. From lead generation to customer retention, we cover everything you need to know.
            </motion.p>
          </div>

          {/* Search and Filter Section */}
          <motion.div
            variants={pageAnimations.item}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12"
          >
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search articles by title, content, or category..."
              />
            </div>

            <div className="lg:text-right">
              <p className="text-sm text-gray-400">
                Showing {filteredPosts.length} of {posts.length} articles
              </p>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            variants={pageAnimations.item}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Articles Grid Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <motion.div
              className="flex items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </motion.div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              className="text-center py-20"
              variants={pageAnimations.item}
              initial="hidden"
              animate="visible"
            >
              <p className="text-gray-400 text-lg mb-4">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={pageAnimations.container}
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  variants={pageAnimations.item}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <ArticleCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="relative py-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of businesses already using Robofy to automate their marketing and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Get Started Free
            </button>
            <button className="border border-gray-600 text-white hover:bg-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
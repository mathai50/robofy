"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { getBlogPostBySlug, formatDate } from '@/lib/blog-utils';
import Badge from '@/components/ui/Badge';

// Page-specific animations
const pageAnimations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  },
  item: {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }
};

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);

      if (!slug) {
        router.push('/blog');
        return;
      }

      const blogPost = await getBlogPostBySlug(slug);

      if (!blogPost) {
        router.push('/blog');
        return;
      }

      setPost(blogPost);

      // Load related posts (same category, different slug)
      const allPosts = await import('@/lib/blog-utils').then(module => module.getAllBlogPosts());
      const related = allPosts
        .filter(p => p.category === blogPost.category && p.slug !== blogPost.slug)
        .slice(0, 3);
      setRelatedPosts(related);

      setIsLoading(false);
    }

    loadPost();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!post) {
    return null; // Router will handle redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <article className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.05),transparent_50%)]"></div>

        <motion.div
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
          variants={pageAnimations.container}
          initial="hidden"
          animate="visible"
        >
          {/* Back Navigation */}
          <motion.div variants={pageAnimations.item} className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              ← Back to Blog
            </Link>
          </motion.div>

          {/* Article Header */}
          <header className="mb-12">
            <motion.div variants={pageAnimations.item}>
              <Badge className="mb-6 bg-blue-600/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm font-medium">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </Badge>
            </motion.div>

            <motion.h1
              variants={pageAnimations.item}
              className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            >
              {post.title}
            </motion.h1>

            <motion.div
              variants={pageAnimations.item}
              className="flex flex-wrap items-center gap-6 text-gray-300"
            >
              <time dateTime={post.date} className="text-lg">
                {formatDate(post.date)}
              </time>
              <span className="text-gray-500">•</span>
              <span className="text-lg">{post.readTime} min read</span>
            </motion.div>
          </header>

          {/* Featured Image */}
          <motion.div
            variants={pageAnimations.item}
            className="mb-12"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={post.image || '/images/blog/default.jpg'}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            variants={pageAnimations.item}
            className="prose prose-lg prose-invert max-w-none"
          >
            <div className="text-gray-300 leading-relaxed space-y-6">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div className="space-y-6">
                  <p className="text-xl leading-relaxed">
                    {post.excerpt}
                  </p>
                  {/* Placeholder content structure */}
                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">Introduction</h2>
                  <p className="text-lg leading-relaxed">
                    This comprehensive guide will walk you through the essential steps of implementing AI marketing automation for your business. We'll cover everything from initial planning to ongoing optimization.
                  </p>

                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">Key Benefits</h2>
                  <p className="text-lg leading-relaxed">
                    AI marketing automation offers numerous advantages including improved lead generation, enhanced customer experiences, and increased operational efficiency.
                  </p>

                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">Getting Started</h2>
                  <p className="text-lg leading-relaxed">
                    The first step in your AI marketing automation journey is proper planning and assessment of your current marketing infrastructure and goals.
                  </p>

                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">Implementation Strategy</h2>
                  <p className="text-lg leading-relaxed">
                    A successful implementation requires careful selection of workflows, proper integration with existing systems, and comprehensive testing.
                  </p>

                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">Measuring Success</h2>
                  <p className="text-lg leading-relaxed">
                    Track key metrics and continuously optimize your AI marketing automation to ensure maximum ROI and business impact.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </article>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="relative py-20 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-3xl font-bold text-white mb-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Related Articles
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={pageAnimations.container}
              initial="hidden"
              animate="visible"
            >
              {relatedPosts.map((relatedPost, index) => (
                <motion.div key={relatedPost.slug} variants={pageAnimations.item}>
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <article className="group bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/70">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={relatedPost.image || '/images/blog/default.jpg'}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <Badge className="mb-3 bg-gray-700/50 text-gray-300 border-gray-600/50 px-3 py-1 text-sm">
                          {relatedPost.category.charAt(0).toUpperCase() + relatedPost.category.slice(1)}
                        </Badge>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <motion.section
        className="relative py-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Marketing?
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
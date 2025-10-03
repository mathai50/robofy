'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGestureNavigation } from '../hooks/useGestureNavigation';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  type: 'achievement' | 'workout' | 'motivation' | 'social';
  tags: string[];
}

const samplePosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.1.0',
      level: 'Elite Member'
    },
    content: 'Just crushed my deadlift PR! 405 lbs for 3 reps 💪 The progressive overload program is working perfectly!',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    type: 'achievement',
    tags: ['#DeadliftPR', '#StrengthTraining', '#ProgressiveOverload']
  },
  {
    id: '2',
    author: {
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.1.0',
      level: 'Premium Member'
    },
    content: 'Morning yoga session complete! 🧘‍♀️ Nothing beats that post-yoga glow and mental clarity.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.1.0',
    timestamp: '4 hours ago',
    likes: 18,
    comments: 5,
    type: 'workout',
    tags: ['#MorningYoga', '#Flexibility', '#MindBody']
  },
  {
    id: '3',
    author: {
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.1.0',
      level: 'Basic Member'
    },
    content: '6 months of consistency and I\'m down 30 lbs! 🎉 The community support here has been incredible. Who else is on their transformation journey?',
    timestamp: '6 hours ago',
    likes: 42,
    comments: 15,
    type: 'motivation',
    tags: ['#Transformation', '#WeightLoss', '#CommunitySupport']
  },
  {
    id: '4',
    author: {
      name: 'Sarah Kim',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.1.0',
      level: 'Premium Member'
    },
    content: 'Group HIIT class was absolutely killer today! 🔥 Special shoutout to Coach Sarah for pushing us to our limits.',
    timestamp: '8 hours ago',
    likes: 31,
    comments: 12,
    type: 'social',
    tags: ['#HIITClass', '#GroupFitness', '#CoachSarah']
  }
];

const typeColors = {
  achievement: 'bg-orange-600',
  workout: 'bg-green-600',
  motivation: 'bg-purple-600',
  social: 'bg-blue-600'
};

const typeIcons = {
  achievement: '🏆',
  workout: '💪',
  motivation: '✨',
  social: '🤝'
};

export const CommunityWall = () => {
  const [posts, setPosts] = useState(samplePosts);
  const [filter, setFilter] = useState<'all' | 'achievement' | 'workout' | 'motivation' | 'social'>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const { ref } = useGestureNavigation({
    onSwipeLeft: () => {
      // Could implement pagination or filtering
    },
    onSwipeRight: () => {
      // Could implement pagination or filtering
    },
    onTap: () => {
      setShowNewPost(!showNewPost);
    }
  });

  const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.type === filter);

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const handleNewPost = () => {
    if (newPostContent.trim()) {
      const newPost: CommunityPost = {
        id: Date.now().toString(),
        author: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop&ixlib=rb-4.1.0',
          level: 'Member'
        },
        content: newPostContent,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        type: 'social',
        tags: []
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gray-700/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gray-600/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gray-800/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 w-full pt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold mb-6"
          >
            Community Wall
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto"
          >
            Connect with fellow fitness enthusiasts, share achievements, and stay motivated
          </motion.p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {(['all', 'achievement', 'workout', 'motivation', 'social'] as const).map((filterType) => (
            <motion.button
              key={filterType}
              onClick={() => setFilter(filterType)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                filter === filterType
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {filterType === 'all' ? 'All Posts' : filterType}
            </motion.button>
          ))}
        </motion.div>

        {/* New Post Composer */}
        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your fitness journey, achievements, or motivate others..."
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-white/60">
                    Share your progress and inspire others! 🌟
                  </span>
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setShowNewPost(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleNewPost}
                      disabled={!newPostContent.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                    >
                      Post
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Feed */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all duration-300"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                    <div>
                      <p className="font-semibold">{post.author.name}</p>
                      <p className="text-sm text-white/60">{post.author.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${typeColors[post.type]} text-white`}>
                      {typeIcons[post.type]} {post.type}
                    </span>
                    <span className="text-sm text-white/60">{post.timestamp}</span>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-white mb-4 leading-relaxed">{post.content}</p>

                {/* Post Image */}
                {post.image && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-6">
                    <motion.button
                      onClick={() => handleLike(post.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-2 text-white/70 hover:text-red-400 transition-colors"
                    >
                      <span>❤️</span>
                      <span className="text-sm">{post.likes}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-colors"
                    >
                      <span>💬</span>
                      <span className="text-sm">{post.comments}</span>
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Share
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Floating Action Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNewPost(!showNewPost)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl z-30 hover:bg-purple-700 transition-colors"
        >
          <span className="text-2xl">+</span>
        </motion.button>

        {/* Gesture Hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-sm"
        >
          <div className="flex items-center space-x-4">
            <span>Swipe to browse posts</span>
            <div className="flex space-x-2">
              <div className="w-8 h-6 border border-white/30 rounded flex justify-center items-center">
                <span className="text-xs">←</span>
              </div>
              <div className="w-8 h-6 border border-white/30 rounded flex justify-center items-center">
                <span className="text-xs">→</span>
              </div>
            </div>
            <span>•</span>
            <span>Tap to compose</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
'use client';

import { BlogCategory, BLOG_CATEGORIES } from '@/types/blog';
import Button from './Button';

interface FilterBarProps {
  selectedCategory: BlogCategory;
  onCategoryChange: (category: BlogCategory) => void;
}

export function FilterBar({ selectedCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div 
        role="tablist" 
        aria-label="Blog categories"
        className="flex space-x-2 pb-4 min-w-max"
      >
        {BLOG_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            role="tab"
            aria-selected={selectedCategory === category}
            aria-controls={`${category}-tabpanel`}
            className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
          >
            {category === 'all' ? 'All Articles' : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
}
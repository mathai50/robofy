import type { Metadata } from 'next';
import { BlogSection } from '@/components/BlogSection';

export const metadata: Metadata = {
  title: 'Resources & Blog - AI-Powered Marketing Insights | Robofy',
  description: 'Explore our comprehensive blog featuring AI-powered marketing strategies, automation tips, and industry insights for beauty, dental, healthcare, retail, fitness, and solar businesses.',
  keywords: 'AI marketing, automation tips, digital marketing strategies, content marketing, lead generation, business growth',
  openGraph: {
    title: 'Resources & Blog - AI-Powered Marketing Insights | Robofy',
    description: 'Discover the latest insights and strategies for AI-powered marketing automation across various industries.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Robofy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources & Blog - AI-Powered Marketing Insights | Robofy',
    description: 'Discover the latest insights and strategies for AI-powered marketing automation across various industries.',
  },
};

export default function BlogPage() {
  return <BlogSection />;
}
'use client';

import ChatInterface from '@/components/ChatInterface';
import { FileText, PenTool, Image, Mic, BarChart3 } from 'lucide-react';

const contentQuickActions = [
  {
    id: 'blog-post',
    label: 'Blog Post',
    description: 'Create a blog article',
    icon: <FileText className="w-5 h-5" />,
    prompt: 'Help me write a blog post about digital marketing trends.'
  },
  {
    id: 'social-media',
    label: 'Social Media',
    description: 'Create social content',
    icon: <PenTool className="w-5 h-5" />,
    prompt: 'Create engaging social media content for my business.'
  },
  {
    id: 'ad-copy',
    label: 'Ad Copy',
    description: 'Write advertising copy',
    icon: <Image className="w-5 h-5" />,
    prompt: 'Help me write compelling ad copy for my products.'
  },
  {
    id: 'video-script',
    label: 'Video Script',
    description: 'Create video content',
    icon: <Mic className="w-5 h-5" />,
    prompt: 'Help me create a script for a marketing video.'
  },
  {
    id: 'seo-execution',
    label: 'SEO Content Execution',
    description: 'Execute SEO recommendations with content creation',
    icon: <BarChart3 className="w-5 h-5" />,
    prompt: `You are an SEO Content Execution Agent tasked with taking high-level, prioritized SEO recommendations and orchestrating the creation of optimized content across multiple platforms, including website pages, social media, and multimedia formats.

Your objective is to:
- Analyze SEO recommendations (keyword usage, content gaps, format suggestions).
- Break down recommendations into detailed content production tasks.
- Coordinate generation of various content assets (text, images, videos).
- Prepare structured briefs for specialized content creators or AI agents.
- Manage task sequencing and prioritization to maximize SEO impact.

***

### Workflow Breakdown and Task Delegation

1. **Input Intake**
   - Receive prioritized SEO recommendations including:
     - Keywords to target (primary, secondary, long-tail)
     - Content topics & themes (new pages, blog posts, FAQs)
     - Suggested content formats (text articles, infographics, videos)
     - Technical SEO notes (schema, metadata improvements)
   - Receive audience and brand tone guidelines.

2. **Content Planning & Strategy**
   - Map recommendations into an overall **content plan** segmented by delivery channel:
     - Website pages (core landing pages, blogs, FAQs)
     - Social media posts (bite-sized content, announcements)
     - Multimedia content (hero images, infographics, short videos)
   - Prioritize content types by SEO impact and resource availability.

3. **Content Brief Generation**
   - For each content piece (page, post, etc.), generate a detailed content brief including:
     - Target keywords and search intent
     - Meta Title and description drafts
     - Suggested headings and subtopics
     - Tone, style, and audience notes
     - Calls to action
     - References to competitor content or inspiration
   - Include clear instructions for content length and technical SEO compliance (schema, tags).

4. **AI or Team Task Assignment**
   - Assign writing tasks to **content creation AI agents or human writers** based on brief.
   - If images or visual assets are needed, generate prompts for an **image generation AI** specifying style, color, and elements consistent with the brand.
   - For video or interactive content, create storyboard briefs or scripts to pass to creators or AI video generation tools.

5. **Content Review & SEO Optimization**
   - Once drafts are ready, request an **SEO optimization pass**:
     - Check keyword usage and density.
     - Optimize metadata.
     - Validate structured data inclusion.
   - Prepare finalized content for publication.

6. **Publishing & Distribution Strategy**
   - Recommend publication timing and channels based on audience behavior and platform.
   - Suggest social media calendar posts, linking strategies, and promotion ideas tied to new content launch.

***

### Output Structure

Deliver a master workflow document or JSON with:

- **Content Plan Overview**
  - List of content pieces by type, priority, and deadline.

- **Individual Content Briefs** (one per content piece)
  - Keywords, meta info, headings, tone, length, references.

- **Media Asset Requests**
  - Image prompts with style, colors, and purpose.
  - Video script or storyboard outlines.

- **Task Assignments & Status**
  - Who/what agent is assigned to each task.
  - Next steps and deadlines.

***

### Additional Notes

- Adapt briefs and assets to platform-specific best practices (e.g., shorter snippets for social, detailed for website).
- Keep SEO goals front and center during all content generation phases.
- Allow iteration and feedback cycles before final publishing.
- Use automation tools for task tracking and reminders if integrated.`
  }
];

export default function ContentCreationPage() {
  return (
    <ChatInterface
      toolName="Content Creation"
      toolDescription="Generate engaging marketing content, blog posts, and social media content"
      apiEndpoint="/api/ai/message"
      quickActions={contentQuickActions}
      placeholder="Ask for help with content creation, blog posts, or marketing copy..."
    />
  );
}
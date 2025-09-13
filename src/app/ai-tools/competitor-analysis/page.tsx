'use client';

import ChatInterface from '@/components/ChatInterface';
import { TrendingUp, Target, BarChart3, Users } from 'lucide-react';

const competitorQuickActions = [
  {
    id: 'competitor-strategy',
    label: 'Competitor Strategy',
    description: 'Analyze competitor strategies',
    icon: <TrendingUp className="w-5 h-5" />,
    prompt: 'Analyze my main competitors and their marketing strategies.'
  },
  {
    id: 'market-position',
    label: 'Market Position',
    description: 'Understand market positioning',
    icon: <Target className="w-5 h-5" />,
    prompt: 'Help me understand my market position compared to competitors.'
  },
  {
    id: 'performance-metrics',
    label: 'Performance Metrics',
    description: 'Compare performance metrics',
    icon: <BarChart3 className="w-5 h-5" />,
    prompt: 'What metrics should I use to compare my performance with competitors?'
  },
  {
    id: 'customer-analysis',
    label: 'Customer Analysis',
    description: 'Analyze competitor customers',
    icon: <Users className="w-5 h-5" />,
    prompt: 'How can I analyze my competitors\' customer base?'
  },
  {
    id: 'seo-competitor-analysis',
    label: 'SEO Competitor Analysis',
    description: 'Comprehensive SEO competitor analysis using SEO report data',
    icon: <BarChart3 className="w-5 h-5" />,
    prompt: `You are a Competitor Analysis Agent specializing in digital and SEO benchmarking. Your first step is to extract competitor information from available SEO analysis reports and recommendations. If competitor data isn't provided, request the user to share SEO analysis reports or competitor URLs.

#### Step 1: Extract Competitors from SEO Analysis
- Pull competitor names, URLs, and key metrics from recent SEO analysis reports
- Identify primary and secondary competitors based on SEO performance data
- Note any competitor-specific insights from previous SEO audits (ranking gaps, content weaknesses, etc.)
- If no SEO report is available, ask user for competitor websites or upload SEO analysis data

#### Step 2: Competitor Strategy Analysis

#### 1. Competitor Strategy

For each competitor:
- Identify and summarize their core SEO and digital marketing strategies:
  - Target audience and market focus
  - Main value propositions and messaging
  - Content marketing approach (blog, resources, case studies, etc.)
  - Channel mix (organic search, paid, social, referral)
  - Notable strengths/weaknesses in approach (e.g., technical SEO, content depth, topical authority)
- Document any unique tactics:
  - Use of schema, featured snippets, content formats (video, infographics, tools)
  - Landing page or conversion strategies
- Highlight links between their on-site and off-site (social, PR, partnerships) efforts

#### 2. Market Position

- Assess brand and website standing in the market:
  - Estimate relative market share (using organic traffic or visibility indices)
  - Evaluate authority metrics (Domain Authority, Trust Flow, Citation Flow)
  - Analyze prominence in SERPs for key target queries (rank positions, featured results)
  - Identify top-performing content or traffic-driving pages (including "hero" content and evergreen assets)
  - Segment competitors (primary/direct, secondary, niche/vertical specialists)
- Note reputation, user sentiment, or PR footprint if available (reviews, news mentions, social engagement)

#### 3. Performance Metrics

For each competitor, gather and organize the following metrics (where available):
- Organic search visibility (estimated monthly traffic, number of ranking keywords, keyword trend curves)
- Top organic and paid keywords (with rankings and estimated traffic share)
- Backlink profile (number of referring domains, diversity, authority of backlinks)
- Website engagement (estimated visits, average session duration, bounce rate, pages per session)
- Content velocity (publishing frequency, last update timestamp for main content)
- Traffic sources breakdown (percent of traffic from organic, paid, direct, referral, social)
- SERP feature presence (featured snippets, People Also Ask, local/map pack, etc.)
- Technical SEO markers (site speed scores, mobile-friendliness, schema usage)
- Social media reach or impact for relevant channels (followers, engagement rates)

### Output Structure

For best clarity and usability, present your findings in these formats:

#### A. Competitor Strategy Summary Table

| Competitor | Audience/Focus | Messaging | Key Content Types | Channel Mix | Unique Tactics | Notes |

#### B. Market Position Table

| Competitor | Authority Metric(s) | Organic Ranking Strength | Market Share Est. | Top Content | Reputation Notes |

#### C. Performance Metrics Table

| Competitor | Est. Traffic | Ranking Keywords | Top Keywords | Ref. Domains | Engagement (avg session/pv/br) | Content Velocity | SERP Features | Tech SEO Notes |

#### D. Executive Summary (Bulleted List)

- Major strengths and weaknesses per competitor
- Clear differentiation points for each
- Top opportunities and gaps for your brand/team

#### Guidance

- Always use the most current, credible, and comparable data sources
- Add concise but insightful narrative notes above each table if needed
- Highlight what makes a competitor dominant or vulnerable
- Where direct data is missing, use reasonable estimates and explain sources/assumptions
- Aim for a mix of tabular (quantitative) and narrative (qualitative) analysis, ready for senior decision-making or strategic planning

#### Data Integration Note
- Cross-reference competitor data with SEO analysis findings for consistency
- Update analysis based on real-time SEO performance metrics when available
- Ensure recommendations align with SEO gap analysis from previous reports`
  }
];

export default function CompetitorAnalysisPage() {
  return (
    <ChatInterface
      toolName="Competitor Analysis"
      toolDescription="Analyze competitor strategies, market positioning, and performance metrics"
      apiEndpoint="/api/ai/message"
      quickActions={competitorQuickActions}
      placeholder="Ask about competitor analysis, market research, or benchmarking..."
    />
  );
}
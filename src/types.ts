// FIX: Update the GroundingChunk type to match the library's definition.
export type AnalysisStatus = 'good' | 'warning' | 'bad';

export interface TechnicalSeoMetric {
  metric: string;
  status: AnalysisStatus;
  recommendation: string;
  details?: string | Record<string, any>;
}

export interface TechnicalSeo {
  overallScore: number;
  performance: TechnicalSeoMetric;
  accessibility: TechnicalSeoMetric;
  bestPractices: TechnicalSeoMetric;
  seo: TechnicalSeoMetric;
  pwa: TechnicalSeoMetric;
}

export interface Keyword {
  keyword: string;
  type: 'Primary' | 'Secondary' | 'LSI';
  notes: string;
}

export interface Competitor {
  rank: number;
  url: string;
  title: string;
  analysis: string;
}

export interface ContentGap {
  topic: string;
  description: string;
  score: number;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface ComprehensiveAnalysis {
  technicalSeo: TechnicalSeo;
  keywords: Keyword[];
  competitors: Competitor[];
  contentGaps: ContentGap[];
  groundingChunks?: GroundingChunk[];
}

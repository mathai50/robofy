import React, { useState } from 'react';
import type { ComprehensiveAnalysis } from '../../types';
import SeoReport from './SeoReport';
import KeywordsTab from './KeywordsTab';
import CompetitorsTab from './CompetitorsTab';
import ContentGapsTab from './ContentGapsTab';
import SourceLinks from './SourceLinks';
import { DocumentTextIcon, KeyIcon, TrophyIcon, LightBulbIcon } from '../../constants';

interface DashboardProps {
  analysis: ComprehensiveAnalysis;
  query: string;
  location: string;
}

type Tab = 'seo' | 'keywords' | 'competitors' | 'gaps';

const Dashboard: React.FC<DashboardProps> = ({ analysis, query, location }) => {
  const [activeTab, setActiveTab] = useState<Tab>('seo');

  const tabs: { id: Tab; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'seo', label: 'Technical SEO', icon: DocumentTextIcon },
    { id: 'keywords', label: 'Keywords', icon: KeyIcon },
    { id: 'competitors', label: 'Competitors', icon: TrophyIcon },
    { id: 'gaps', label: 'Content Gaps', icon: LightBulbIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'seo':
        return <SeoReport techSeo={analysis.technicalSeo} />;
      case 'keywords':
        return <KeywordsTab keywords={analysis.keywords} />;
      case 'competitors':
        return <CompetitorsTab competitors={analysis.competitors} query={query} location={location} />;
      case 'gaps':
        return <ContentGapsTab contentGaps={analysis.contentGaps} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
        <div className="text-center mb-8 bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
            <p className="text-slate-400">
                Showing results for keyword <span className="font-semibold text-sky-400">"{query}"</span> in <span className="font-semibold text-sky-400">{location}</span>
            </p>
        </div>
      <div className="mb-6 border-b border-slate-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        {renderContent()}
      </div>
      
      {analysis.groundingChunks && analysis.groundingChunks.length > 0 && activeTab === 'seo' && (
        <div className="mt-8">
            <SourceLinks chunks={analysis.groundingChunks} />
        </div>
      )}

    </div>
  );
};

export default Dashboard;
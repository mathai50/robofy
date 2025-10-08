import React from 'react';
import type { TechnicalSeo } from '../../types';
import ScoreGauge from './ScoreGauge';
import ReportCard from './ReportCard';

interface SeoReportProps {
  techSeo: TechnicalSeo;
}

const SeoReport: React.FC<SeoReportProps> = ({ techSeo }) => {
  return (
    <div className="animate-fade-in">
        <h3 className="text-2xl font-bold text-white mb-1">Technical SEO Analysis</h3>
        <p className="text-slate-400 mb-6">Based on Google PageSpeed Insights data.</p>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <div className="flex-shrink-0">
                <h4 className="text-lg font-semibold text-center mb-2 text-slate-300">Overall Score</h4>
                <ScoreGauge technicalSeo={techSeo} />
            </div>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                <ReportCard title="Performance" status={techSeo.performance.status} recommendation={techSeo.performance.recommendation}>
                    <p className="text-3xl font-bold text-slate-100">{techSeo.performance.metric}<span className="text-base font-normal text-slate-400">/100</span></p>
                </ReportCard>
                <ReportCard title="Accessibility" status={techSeo.accessibility.status} recommendation={techSeo.accessibility.recommendation}>
                    <p className="text-3xl font-bold text-slate-100">{techSeo.accessibility.metric}<span className="text-base font-normal text-slate-400">/100</span></p>
                </ReportCard>
                 <ReportCard title="Best Practices" status={techSeo.bestPractices.status} recommendation={techSeo.bestPractices.recommendation}>
                    <p className="text-3xl font-bold text-slate-100">{techSeo.bestPractices.metric}<span className="text-base font-normal text-slate-400">/100</span></p>
                </ReportCard>
                 <ReportCard title="SEO" status={techSeo.seo.status} recommendation={techSeo.seo.recommendation}>
                    <p className="text-3xl font-bold text-slate-100">{techSeo.seo.metric}<span className="text-base font-normal text-slate-400">/100</span></p>
                </ReportCard>
                <ReportCard title="PWA" status={techSeo.pwa.status} recommendation={techSeo.pwa.recommendation}>
                    <p className="text-3xl font-bold text-slate-100">{techSeo.pwa.metric}<span className="text-base font-normal text-slate-400">/100</span></p>
                </ReportCard>
            </div>
        </div>
    </div>
  );
};

export default SeoReport;
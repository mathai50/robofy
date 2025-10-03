'use client';

import React from 'react';
import type { TechnicalSeo, AnalysisStatus } from '../../types';
import { 
  Activity, 
  Eye, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

const getStatusIcon = (status: AnalysisStatus) => {
  switch (status) {
    case 'good': return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'bad': return <AlertCircle className="h-5 w-5 text-red-500" />;
    default: return <Activity className="h-5 w-5 text-slate-500" />;
  }
};

const getStatusColor = (status: AnalysisStatus) => {
  switch (status) {
    case 'good': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'bad': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

interface ReportCardProps {
  technicalSeo: TechnicalSeo;
}

const ReportCard: React.FC<ReportCardProps> = ({ technicalSeo }) => {
  const metrics = [
    { key: 'performance', label: 'Performance', icon: Activity },
    { key: 'accessibility', label: 'Accessibility', icon: Eye },
    { key: 'bestPractices', label: 'Best Practices', icon: CheckCircle },
    { key: 'seo', label: 'SEO', icon: Activity },
    { key: 'pwa', label: 'PWA', icon: AlertCircle },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {metrics.map(({ key, label, icon: Icon }) => {
        const metric = technicalSeo[key as keyof TechnicalSeo] as any;
        const status = metric?.status || 'good';
        const score = technicalSeo.overallScore;

        return (
          <div key={key} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Icon className="h-6 w-6 text-slate-400 mr-2" />
              <span className="text-sm font-medium text-slate-400">{label}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{Math.round(score)}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {getStatusIcon(status)}
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                {status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">{metric?.recommendation || 'No recommendations available'}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ReportCard;
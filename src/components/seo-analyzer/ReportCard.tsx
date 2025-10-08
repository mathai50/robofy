'use client';

import React from 'react';
import type { AnalysisStatus } from '../../types';
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
  title: string;
  status: AnalysisStatus;
  recommendation: string;
  children: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, status, recommendation, children }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
      <h5 className="text-sm font-medium text-slate-400 mb-2">{title}</h5>
      {children}
      <div className="flex items-center justify-center gap-1 mb-2">
        {getStatusIcon(status)}
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(status)}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <p className="text-xs text-slate-500 line-clamp-2">{recommendation}</p>
    </div>
  );
};

export default ReportCard;
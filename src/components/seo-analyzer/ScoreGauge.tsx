'use client';

import React from 'react';
import type { TechnicalSeo } from '../../types';

interface ScoreGaugeProps {
  technicalSeo: TechnicalSeo;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ technicalSeo }) => {
  const score = technicalSeo.overallScore;
  const percentage = score;
  const color = score >= 80 ? 'from-green-500 to-green-600' : 
                score >= 60 ? 'from-yellow-500 to-yellow-600' : 
                'from-red-500 to-red-600';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-slate-700 stroke-current"
            fill="none"
            strokeWidth="3"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`text-transparent fill-current ${color} stroke-current`}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 0.565}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{Math.round(score)}</div>
            <div className="text-sm text-slate-400">/100</div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-300">Overall SEO Score</p>
    </div>
  );
};

export default ScoreGauge;
import React from 'react';
import type { Keyword } from '../types';

interface KeywordsTabProps {
  keywords: Keyword[];
}

const getBadgeClass = (type: string) => {
    switch(type) {
        case 'Primary': return 'bg-sky-800 text-sky-200 border-sky-600';
        case 'Secondary': return 'bg-teal-800 text-teal-200 border-teal-600';
        case 'LSI': return 'bg-slate-700 text-slate-300 border-slate-600';
        default: return 'bg-gray-700 text-gray-300 border-gray-600';
    }
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({ keywords }) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-white mb-1">Keyword Analysis</h3>
      <p className="text-slate-400 mb-6">Keywords identified from top-ranking pages for your target query.</p>
      <div className="overflow-x-auto bg-slate-800/50 border border-slate-700 rounded-lg">
        <table className="min-w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">Keyword</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw, index) => (
              <tr key={index} className="border-b border-slate-700 hover:bg-slate-800/70 transition-colors">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{kw.keyword}</th>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getBadgeClass(kw.type)}`}>
                        {kw.type}
                    </span>
                </td>
                <td className="px-6 py-4 text-slate-400">{kw.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordsTab;
import React from 'react';
import type { Competitor } from '../../types';
import { LinkIcon } from '../../constants';

interface CompetitorsTabProps {
  competitors: Competitor[];
  query: string;
  location: string;
}

const CompetitorsTab: React.FC<CompetitorsTabProps> = ({ competitors, query, location }) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-white mb-1">Competitor Analysis</h3>
      <p className="text-slate-400 mb-6">Validated business competitors for <span className="font-semibold text-slate-300">"{query}"</span> in <span className="font-semibold text-slate-300">{location}</span>.</p>
      {competitors.length > 0 ? (
         <div className="overflow-x-auto bg-slate-800/50 border border-slate-700 rounded-lg">
          <table className="min-w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800">
              <tr>
                <th scope="col" className="px-6 py-3 w-12 text-center">Rank</th>
                <th scope="col" className="px-6 py-3">Competitor</th>
                <th scope="col" className="px-6 py-3">Strategic Analysis</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => (
                <tr key={c.rank} className="border-b border-slate-700 hover:bg-slate-800/70 transition-colors">
                  <td className="px-6 py-4 text-center">
                      <span className="font-bold text-lg text-white">{c.rank}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white max-w-sm">
                      <p className="font-semibold truncate" title={c.title}>{c.title}</p>
                      <a 
                          href={c.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sky-400 hover:text-sky-300 text-xs hover:underline truncate flex items-center gap-1 mt-1"
                          title={c.url}
                      >
                          <LinkIcon className="w-3 h-3" />
                          {c.url}
                      </a>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{c.analysis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center bg-slate-800/50 border border-slate-700 p-8 rounded-lg">
          <h4 className="text-lg font-semibold text-slate-100">No Business Competitors Found</h4>
          <p className="text-slate-400 mt-2">The Gemini agent could not identify relevant business competitors from the search results. The analysis for keywords and content gaps may be limited. Please try a different keyword or location.</p>
        </div>
      )}
    </div>
  );
};

export default CompetitorsTab;